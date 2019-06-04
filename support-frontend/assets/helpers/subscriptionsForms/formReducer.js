// @flow

// ----- Reducer ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import { getUser } from 'helpers/subscriptionsForms/user';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { defaultPaymentMethod } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { isTestUser } from 'helpers/user/user';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { removeError } from 'helpers/subscriptionsForms/validation';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import type { Option } from 'helpers/types/option';

function createFormReducer(
  initialCountry: IsoCountry,
  product: SubscriptionProduct,
  initialBillingPeriod: BillingPeriod,
  startDate: Option<string>,
  productOption: Option<ProductOptions>,
  fulfilmentOption: Option<FulfilmentOptions>,
) {
  const user = getUser(); // TODO: Is this unnecessary? It could use the user reducer
  const { productPrices } = window.guardian;

  const initialState = {
    stage: 'checkout',
    product,
    title: null,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    startDate,
    telephone: null,
    billingAddressIsSame: null,
    billingPeriod: initialBillingPeriod,
    paymentMethod: defaultPaymentMethod(initialCountry, product),
    formErrors: [],
    submissionError: null,
    formSubmitted: false,
    isTestUser: isTestUser(),
    productPrices,
    productOption: productOption || NoProductOptions,
    fulfilmentOption: fulfilmentOption || NoFulfilmentOptions,
    payPalHasLoaded: false,
  };


  return (state: FormState = initialState, action: Action): FormState => {

    switch (action.type) {

      case 'SET_STAGE':
        return { ...state, stage: action.stage };

      case 'SET_TITLE':
        return { ...state, title: action.title };

      case 'SET_FIRST_NAME':
        return { ...state, firstName: action.firstName, formErrors: removeError('firstName', state.formErrors) };

      case 'SET_LAST_NAME':
        return { ...state, lastName: action.lastName, formErrors: removeError('lastName', state.formErrors) };

      case 'SET_TELEPHONE':
        return { ...state, telephone: action.telephone };

      case 'SET_START_DATE':
        return { ...state, startDate: action.startDate };

      case 'SET_BILLING_PERIOD':
        return { ...state, billingPeriod: action.billingPeriod };

      case 'SET_COUNTRY_CHANGED':
        return {
          ...state,
          paymentMethod: defaultPaymentMethod(action.country, product),
        };

      case 'SET_PAYMENT_METHOD':
        return {
          ...state,
          paymentMethod: action.paymentMethod,
          formErrors: removeError('paymentMethod', state.formErrors),
        };

      case 'SET_FORM_ERRORS':
        return { ...state, formErrors: action.errors };

      case 'SET_SUBMISSION_ERROR':
        return { ...state, submissionError: action.error, formSubmitted: false };

      case 'SET_FORM_SUBMITTED':
        return { ...state, formSubmitted: action.formSubmitted };

      case 'SET_BILLING_ADDRESS_IS_SAME':
        return {
          ...state,
          billingAddressIsSame: action.isSame,
          formErrors: removeError('billingAddressIsSame', state.formErrors),
        };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };

      default:
        return state;
    }
  };
}

export { createFormReducer };
