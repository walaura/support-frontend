// @flow

// ----- Imports ----- //

import React from 'react';

import SvgCreditCard from 'components/svgs/creditCard';
import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Status } from 'helpers/switch';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';
import {
  setupStripeCheckout,
  openDialogBox,
} from 'helpers/paymentIntegrations/stripeCheckout';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  amount: number,
  callback: (token: string) => Promise<*>,
  closeHandler: () => void,
  currencyId: IsoCurrency,
  email: string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  canOpen: () => boolean,
  switchStatus: Status,
|};
/* eslint-enable react/no-unused-prop-types */


// ----- Functions ----- //

function isStripeSetup(): boolean {
  return window.StripeCheckout !== undefined;
}


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => (
  <Switchable
    status={props.switchStatus}
    component={() => <Button {...props} />}
    fallback={() => <PaymentError paymentMethod="credit/debit card" />}
  />
);


// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  if (!isStripeSetup()) {
    setupStripeCheckout(props.callback, props.closeHandler, props.currencyId, props.isTestUser);
  }

  const onClick = () => {
    // Don't open Stripe Checkout for automated tests, call the backend immediately
    if (props.isPostDeploymentTestUser) {
      const testTokenId = 'tok_visa';
      props.callback(testTokenId);
    } else if (props.canOpen && props.canOpen()) {
      storage.setSession('paymentMethod', 'Stripe');
      openDialogBox(props.amount, props.email);
    }
  };

  return (
    <button
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={onClick}
    >
      Pay with debit/credit card <SvgCreditCard />
    </button>
  );

}


// ----- Default Props ----- //

StripePopUpButton.defaultProps = {
  canOpen: () => true,
  closeHandler: () => {},
  switchStatus: 'On',
};


// ----- Exports ----- //

export default StripePopUpButton;
