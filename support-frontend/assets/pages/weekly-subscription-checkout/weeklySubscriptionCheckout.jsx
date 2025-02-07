// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { renderPage } from 'helpers/render';
import { init as pageInit } from 'helpers/page/page';

import Page from 'components/page/page';
import WeeklyFooter from 'components/footerCompliant/WeeklyFooter';
import 'stylesheets/skeleton/skeleton.scss';
import CheckoutStage from 'components/subscriptionCheckouts/stage';
import ThankYouContent from './components/thankYou';
import WeeklyCheckoutForm from './components/weeklyCheckoutForm';
import WeeklyCheckoutFormGifting from './components/weeklyCheckoutFormGifting';
import type { CommonState } from 'helpers/page/commonReducer';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { GuardianWeekly } from 'helpers/subscriptions';
import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { Quarterly } from 'helpers/billingPeriods';
import { getQueryParameter } from 'helpers/url';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { Domestic } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
  getProductPrice,
} from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { formatMachineDate } from 'helpers/dateConversions';
import { promotionTermsUrl } from 'helpers/routes';

import HeaderWrapper from 'components/subscriptionCheckouts/headerWrapper';

// ----- Redux Store ----- //
const billingPeriodInUrl = getQueryParameter('period');
const initialBillingPeriod: WeeklyBillingPeriod = billingPeriodInUrl === 'SixWeekly' || billingPeriodInUrl === 'Quarterly' || billingPeriodInUrl === 'Annual'
  ? billingPeriodInUrl
  : Quarterly;

const startDate = formatMachineDate(getWeeklyDays()[0]);
const reducer = (commonState: CommonState) => createWithDeliveryCheckoutReducer(
  commonState.internationalisation.countryId,
  GuardianWeekly,
  initialBillingPeriod,
  startDate,
  NoProductOptions,
  Domestic, // TODO: we need to work this out from the country
);

const store = pageInit(
  reducer,
  true,
);


const {
  orderIsAGift, billingPeriod, productPrices, fulfilmentOption, productOption,
} = store.getState().page.checkout;
const { countryId } = store.getState().common.internationalisation;

const productPrice = getProductPrice(productPrices, countryId, billingPeriod, fulfilmentOption, productOption);
const appliedPromo = getAppliedPromo(productPrice.promotions);
const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
const promoTermsLink = promotionTermsUrl(appliedPromo ? appliedPromo.promoCode : defaultPromo);

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<HeaderWrapper />}
      footer={<WeeklyFooter promoTermsLink={promoTermsLink} />}
    >
      <CheckoutStage
        checkoutForm={orderIsAGift ? <WeeklyCheckoutFormGifting /> : <WeeklyCheckoutForm />}
        thankYouContentPending={<ThankYouContent isPending orderIsGift={orderIsAGift} />}
        thankYouContent={<ThankYouContent isPending={false} orderIsGift={orderIsAGift} />}
        subscriptionProduct="GuardianWeekly"
      />
    </Page>
  </Provider>
);

renderPage(content, 'weekly-subscription-checkout-page');
