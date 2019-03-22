// @flow

import React from 'react';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Rows from 'components/base/rows';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { type Option } from 'helpers/types/option';
import type { OptimizeExperiment } from 'helpers/optimize/optimize';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

type PropTypes = {|
  countrySupportsDirectDebit: boolean,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  payPalEnabled: OptimizeExperiment | boolean,
  multiplePaymentMethodsEnabled: OptimizeExperiment | boolean,
|}

function PaymentMethodSelector(props: PropTypes) {

  return (
    <>
      <Rows gap="large">
        {props.multiplePaymentMethodsEnabled &&
        <div>
          <Fieldset legend="How would you like to pay?">
            {props.countrySupportsDirectDebit &&
            <RadioInput
              image={<SvgDirectDebitSymbol />}
              text="Direct debit"
              name="paymentMethod"
              checked={props.paymentMethod === DirectDebit}
              onChange={() => props.setPaymentMethod(DirectDebit)}
            />}
            <RadioInput
              image={<SvgNewCreditCard />}
              text="Credit/Debit card"
              name="paymentMethod"
              checked={props.paymentMethod === Stripe}
              onChange={() => props.setPaymentMethod(Stripe)}
            />
            {props.payPalEnabled &&
            <RadioInput
              image={<SvgPayPal />}
              text="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === PayPal}
              onChange={() => props.setPaymentMethod(PayPal)}
            />}
          </Fieldset>
        </div>
        }
      </Rows>
      <DirectDebitPopUpForm
        onPaymentAuthorisation={(pa: PaymentAuthorisation) => {
          props.onPaymentAuthorised(pa);
        }}
      />
    </>
  );
}

export { PaymentMethodSelector };
