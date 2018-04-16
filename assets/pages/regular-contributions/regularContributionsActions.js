// @flow

// ----- Imports ----- //

import type { PayPalButtonType } from './components/regularContributionsPayment';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: PayPalButtonType }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'CREATING_CONTRIBUTOR' };


// ----- Actions ----- //

function checkoutError(specificError: ?string): Action {
  const defaultError = 'There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.';
  const message = specificError || defaultError;
  return { type: 'CHECKOUT_ERROR', message };
}

function setPayPalButton(value: PayPalButtonType): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}

function setPayPalHasLoaded(): Action {
  return { type: 'SET_PAYPAL_HAS_LOADED' };
}

function creatingContributor(): Action {
  return { type: 'CREATING_CONTRIBUTOR' };
}

// ----- Exports ----- //

export {
  checkoutError,
  setPayPalButton,
  setPayPalHasLoaded,
  creatingContributor,
};