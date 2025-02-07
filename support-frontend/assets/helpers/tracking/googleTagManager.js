// @flow

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import type { Participations } from 'helpers/abTests/abtest';
import { getVariantsAsString } from 'helpers/abTests/abtest';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import { onConsentChangeEvent } from './thirdPartyTrackingConsent';
import { DirectDebit, type PaymentMethod, PayPal } from '../paymentMethods';

// ----- Types ----- //
type EventType = 'DataLayerReady' | 'SuccessfulConversion' | 'GAEvent' | 'AppStoreCtaClick';

type PaymentRequestAPIStatus =
  'PaymentRequestAPINotAvailable' |
  'CanMakePaymentNotAvailable' |
  'AvailableNotInUse' |
  'AvailableInUse' |
  'PaymentRequestAPIError' |
  'PromiseNotSupported' |
  'PromiseRejected' |
  'PaymentApiPromiseRejected';

type GaEventData = {
  category: string,
  action: string,
  label: ?string,
}

const googleAnalyticsKey = 'googleAnalytics';
const googleTagManagerKey = 'googleTagManager';

const vendorIds: {
  [key: string]: string
} = {
  [googleAnalyticsKey]: '5e542b3a4cd8884eb41b5a72',
  [googleTagManagerKey]: '5e952f6107d9d20c88e7c975',
};

const gaPropertyId = 'UA-51507017-5';

// Default scriptAdded to false
let scriptAdded: boolean = false;
// Default userHasGrantedConsent to false
let userHasGrantedConsent: boolean = false;
// We store tracking events in these queues when userHasGrantedConsent is false
const googleTagManagerDataQueue: Array<() => void> = [];
const googleAnalyticsEventQueue: Array<() => void> = [];

// ----- Functions ----- //

function getOrderId() {
  let value = storage.getSession('orderId');
  if (value === null) {
    value = uuidv4();
    storage.setSession('orderId', value);
  }
  return value;
}

function getCurrency(): string {
  const currency = detectCurrency(detectCountryGroup());
  if (currency) {
    storage.setSession('currency', currency);
  }
  return storage.getSession('currency') || 'GBP';
}

function getContributionValue(): number {
  const param = getQueryParameter('contributionValue');
  if (param) {
    storage.setSession('contributionValue', String(parseFloat(param)));
  }
  return parseFloat(storage.getSession('contributionValue')) || 0;
}

function getPaymentAPIStatus(): Promise<PaymentRequestAPIStatus> {
  return new Promise((resolve) => {
    try {

      const { PaymentRequest } = window;

      if (typeof PaymentRequest !== 'function') {
        resolve('PaymentRequestAPINotAvailable');
      }

      const supportedInstruments = [
        {
          supportedMethods: 'basic-card',
          data: {
            supportedNetworks: ['visa', 'mastercard', 'amex', 'jcb',
              'diners', 'discover', 'mir', 'unionpay'],
            supportedTypes: ['credit', 'debit'],
          },
        },
      ];

      const details = {
        total: {
          label: 'tracking',
          amount:
            {
              value: '1',
              currency: getCurrency(),
            },
        },
      };

      const request = new PaymentRequest(supportedInstruments, details);
      if (request && !request.canMakePayment) {
        resolve('CanMakePaymentNotAvailable');
      }

      request
        .canMakePayment()
        .then((result) => {
          if (result) {
            resolve('AvailableInUse');
          } else {
            resolve('AvailableNotInUse');
          }
        })
        .catch(() => {
          resolve('PaymentApiPromiseRejected');
        });
    } catch (e) {
      resolve('PaymentRequestAPIError');
    }
  });
}

function ophanPaymentMethod(paymentMethod: ?PaymentMethod) {
  switch (paymentMethod) {
    case DirectDebit: return 'Gocardless';
    case PayPal: return 'Paypal';
    default: return paymentMethod;
  }

}

// Perform any conversions on the data being sent
// for instance we need to convert the payment method
// from our PaymentMethod type to Ophan's type so that
// it is consistent with the conversion data from
// the acquisition-event-producer library
function mapFields(data: Object) {
  const { paymentMethod, ...others } = data;
  return {
    paymentMethod: ophanPaymentMethod(paymentMethod),
    ...others,
  };
}

function push(data: Object) {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];
  window.googleTagManagerDataLayer.push(mapFields(data));
}

function getData(
  event: EventType,
  participations: Participations,
  paymentRequestApiStatus?: PaymentRequestAPIStatus,
): Object {
  const orderId = getOrderId();
  const value = getContributionValue();
  const currency = getCurrency();

  return {
    event,
    /**
     * orderId anonymously identifies this user in this session.
     * We need this to prevent page refreshes on conversion pages being
     * treated as new conversions
     * */
    orderId,
    currency,
    value,
    /**
     * getData is only executed via runWithConsentCheck when user has
     * Opted In to tracking, so we can hardcode thirdPartyTrackingConsent
     * to "OptedIn".
     * */
    thirdPartyTrackingConsent: 'OptedIn',
    paymentMethod: storage.getSession('selectedPaymentMethod') || undefined,
    campaignCodeBusinessUnit: getQueryParameter('CMP_BUNIT') || undefined,
    campaignCodeTeam: getQueryParameter('CMP_TU') || undefined,
    internalCampaignCode: getQueryParameter('INTCMP') || undefined,
    experience: getVariantsAsString(participations),
    paymentRequestApiStatus,
  };
}

function sendData(
  event: EventType,
  participations: Participations,
  paymentRequestApiStatus?: PaymentRequestAPIStatus,
) {
  const dataToPush = getData(event, participations, paymentRequestApiStatus);

  const pushDataToGTM = () => {
    push(dataToPush);
  };

  /**
   * If userHasGrantedConsent process event immediately,
   * else add to googleTagManagerDataQueue.
   */
  if (userHasGrantedConsent) {
    pushDataToGTM();
  } else {
    googleTagManagerDataQueue.push(pushDataToGTM);
  }
}

function pushToDataLayer(event: EventType, participations: Participations) {
  try {
    getPaymentAPIStatus()
      .then((paymentRequestApiStatus) => {
        sendData(event, participations, paymentRequestApiStatus);
      })
      .catch(() => {
        sendData(event, participations, 'PromiseRejected');
      });
  } catch (e) {
    sendData(event, participations, 'PromiseNotSupported');
  }
}

function processQueues() {
  while (googleAnalyticsEventQueue.length > 0) {
    const queuedEvent = googleAnalyticsEventQueue.shift();
    queuedEvent();
  }

  while (googleTagManagerDataQueue.length > 0) {
    const queuedEvent = googleTagManagerDataQueue.shift();
    queuedEvent();
  }
}

function addTagManagerScript() {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];

  window.googleTagManagerDataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const firstScript = document.getElementsByTagName('script')[0];
  const googleTagManagerScript = document.createElement('script');

  googleTagManagerScript.defer = true;
  googleTagManagerScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-W6GJ68L&l=googleTagManagerDataLayer';
  /**
   * After Google Tag Manager has loaded we can
   * process pending events in googleAnalyticsEventQueue and
   * googleTagManagerDataQueue if userHasGrantedConsent. This also
   * clears the queues as it executes each function in them.
  */
  googleTagManagerScript.onload = processQueues;

  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(googleTagManagerScript, firstScript);
    scriptAdded = true;
  }
}

function init(participations: Participations) {
  /**
    * The callback passed to onConsentChangeEvent is called
    * each time consent changes. EG. if a user consents via the CMP.
    * The callback will receive the user's consent as the parameter
    * "thirdPartyTrackingConsent".
  */
  onConsentChangeEvent((thirdPartyTrackingConsent: {
    [key: string]: boolean
  }) => {
    /**
      * Update userHasGrantedConsent value when
      * consent changes via the CMP library.
      * For now userHasGrantedConsent will be true only
      * if user has consented to BOTH GoogleTagManager and GoogleAnalytics
    */
    userHasGrantedConsent =
        thirdPartyTrackingConsent[googleAnalyticsKey] && thirdPartyTrackingConsent[googleTagManagerKey];

    if (userHasGrantedConsent) {
      if (!scriptAdded) {
        /**
         * Instruction for Google Analytics
         * to leverage the TCFv2 framework
        */
        window.gtag_enable_tcf_support = true;
        /**
          * Add Google Tag Manager script to the page
          * If it hasn't been added already.
        */
        addTagManagerScript();
      } else {
        /**
          * If Google Tag Manager script has benn added already process pending events
          * in googleAnalyticsEventQueue and googleTagManagerDataQueue. This also
          * clears the queues as it executes each function in them.
        */
        processQueues();
      }
    }
  }, vendorIds);

  pushToDataLayer('DataLayerReady', participations);
}

function successfulConversion(participations: Participations) {
  sendData('SuccessfulConversion', participations);
}

function gaEvent(gaEventData: GaEventData, additionalFields: ?Object) {
  const pushEventToGA = () => {
    push({
      event: 'GAEvent',
      eventCategory: gaEventData.category,
      eventAction: gaEventData.action,
      eventLabel: gaEventData.label,
      ...additionalFields,
    });
  };

  /**
   * If userHasGrantedConsent process event immediately,
   * else add to googleAnalyticsEventQueue.
   */
  if (userHasGrantedConsent) {
    pushEventToGA();
  } else {
    googleAnalyticsEventQueue.push(pushEventToGA);
  }
}

function appStoreCtaClick() {
  sendData('AppStoreCtaClick', { TestName: '' });
}

// ----- Exports ---//

export {
  init,
  gaEvent,
  successfulConversion,
  appStoreCtaClick,
  gaPropertyId,
  mapFields,
};
