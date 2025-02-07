// @flow

// ----- Imports ----- //

import { type Store } from 'redux';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import { getQueryParameter } from 'helpers/url';
import {
  getContributionTypeFromSession,
  getContributionTypeFromUrl,
  getPaymentMethodFromSession,
  getValidPaymentMethods,
  getValidContributionTypesFromUrlOrElse,
} from 'helpers/checkouts';
import { type ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type Action,
  checkIfEmailHasPassword,
  selectAmount, setGuestAccountCreationToken,
  updateContributionTypeAndPaymentMethod, updatePaymentMethod, updateSelectedExistingPaymentMethod,
  updateUserFormData,
  setThankYouPageStage,
  loadPayPalExpressSdk, loadAmazonPaySdk,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import {
  isUsableExistingPaymentMethod,
  mapExistingPaymentMethodToPaymentMethod, sendGetExistingPaymentMethodsRequest,
} from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import { setExistingPaymentMethods, setContributionTypes } from 'helpers/page/commonActions';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import { isSwitchOn } from 'helpers/globals';
import type { ContributionTypes } from 'helpers/contributions';
import { getCampaignSettings } from 'helpers/campaigns';
import { loadRecaptchaV2 } from '../../helpers/recaptcha';
import { AmazonPay, PayPal } from 'helpers/paymentMethods';

// ----- Functions ----- //

function getInitialPaymentMethod(
  contributionType: ContributionType,
  countryId: IsoCountry,
  switches: Switches,
): PaymentMethod {
  const paymentMethodFromSession = getPaymentMethodFromSession();
  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  if (
    paymentMethodFromSession &&
    validPaymentMethods.includes(paymentMethodFromSession)
  ) {
    return paymentMethodFromSession;
  }
  return 'None';
}

function getInitialContributionType(
  countryGroupId: CountryGroupId,
  contributionTypes: ContributionTypes,
): ContributionType {

  const contributionType = getContributionTypeFromUrl() || getContributionTypeFromSession();

  // make sure we don't select a contribution type which isn't on the page
  if (contributionType &&
    contributionTypes[countryGroupId].find(ct => ct.contributionType === contributionType)) {
    return contributionType;
  }

  const defaultContributionType = contributionTypes[countryGroupId].find(ct => ct.isDefault);
  return defaultContributionType ?
    defaultContributionType.contributionType :
    contributionTypes[countryGroupId][0].contributionType;
}

function initialisePaymentMethods(
  state: State,
  dispatch: Function,
) {
  const { currencyId } = state.common.internationalisation;

  // initiate fetch of existing payment methods
  const userAppearsLoggedIn = doesUserAppearToBeSignedIn();
  const existingDirectDebitON = isSwitchOn('recurringPaymentMethods.existingDirectDebit');
  const existingCardON = isSwitchOn('recurringPaymentMethods.existingCard');
  const existingPaymentsEnabledViaUrlParam = getQueryParameter('displayExistingPaymentOptions') === 'true';
  if (userAppearsLoggedIn && (existingCardON || existingDirectDebitON) && existingPaymentsEnabledViaUrlParam) {
    sendGetExistingPaymentMethodsRequest(
      currencyId,
      (allExistingPaymentMethods: ExistingPaymentMethod[]) => {
        const switchedOnExistingPaymentMethods = allExistingPaymentMethods.filter(existingPaymentMethod => (
          (existingPaymentMethod.paymentType === 'Card' && existingCardON) ||
          (existingPaymentMethod.paymentType === 'DirectDebit' && existingDirectDebitON)
        ));
        dispatch(setExistingPaymentMethods(switchedOnExistingPaymentMethods));
        const firstExistingPaymentMethod = (switchedOnExistingPaymentMethods[0]: any);
        const allowDefaultSelectedPaymentMethod = state.common.abParticipations.defaultPaymentMethodTest === 'control';

        if (
          allowDefaultSelectedPaymentMethod &&
          firstExistingPaymentMethod &&
          isUsableExistingPaymentMethod(firstExistingPaymentMethod)
        ) {
          dispatch(updatePaymentMethod(mapExistingPaymentMethodToPaymentMethod(firstExistingPaymentMethod)));
          dispatch(updateSelectedExistingPaymentMethod(firstExistingPaymentMethod));
        }
      },
    );
  } else {
    dispatch(setExistingPaymentMethods([]));
  }
}

function selectInitialAmounts(state: State, dispatch: Function) {
  const { amounts } = state.common.settings;
  const { countryGroupId } = state.common.internationalisation;

  Object.keys(amounts[countryGroupId]).forEach((contributionType) => {
    const defaultAmount =
      amounts[countryGroupId][contributionType].find(amount => amount.isDefault) ||
      amounts[countryGroupId][contributionType][0];

    dispatch(selectAmount(defaultAmount, contributionType));
  });
}

// Override the settings from the server if contributionTypes are defined in url params or campaign settings
function getContributionTypes(state: State): ContributionTypes {
  const campaignSettings = getCampaignSettings();
  if (campaignSettings && campaignSettings.contributionTypes) {
    return campaignSettings.contributionTypes;
  }

  return getValidContributionTypesFromUrlOrElse(state.common.settings.contributionTypes);
}

function selectInitialContributionTypeAndPaymentMethod(
  state: State,
  dispatch: Function,
  contributionTypes: ContributionTypes,
) {

  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { countryGroupId } = state.common.internationalisation;
  const contributionType = getInitialContributionType(countryGroupId, contributionTypes);
  const paymentMethod = getInitialPaymentMethod(contributionType, countryId, switches);
  dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethod));

  switch (paymentMethod) {
    case PayPal:
      dispatch(loadPayPalExpressSdk(contributionType));
      break;
    case AmazonPay:
      dispatch(loadAmazonPaySdk(countryGroupId, state.page.user.isTestUser || false));
      break;
    default:
  }
}

const init = (store: Store<State, Action, Function>) => {
  const { dispatch } = store;

  const state = store.getState();

  // TODO - move these settings out of the redux store, as they only change once, upon initialisation
  const contributionTypes = getContributionTypes(state);
  dispatch(setContributionTypes(contributionTypes));

  initialisePaymentMethods(state, dispatch);

  // This will be in window.guardian if it has come from a PayPal one-off contribution,
  // where it is returned by the Payment API to the backend, flashed into the session to preserve
  // it through a serverside redirect, and then written into window.guardian on the thank-you page.
  if (window.guardian.guestAccountCreationToken) {
    dispatch(setGuestAccountCreationToken(window.guardian.guestAccountCreationToken));
    dispatch(setThankYouPageStage('thankYouSetPassword'));
  }

  selectInitialAmounts(state, dispatch);
  selectInitialContributionTypeAndPaymentMethod(state, dispatch, contributionTypes);

  const {
    firstName,
    lastName,
    email,
    stateField,
  } = state.page.user;

  dispatch(checkIfEmailHasPassword(email));
  dispatch(updateUserFormData({
    firstName, lastName, email, billingState: stateField,
  }));

  loadRecaptchaV2();
};


// ----- Exports ----- //

export { init };
