// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { caStates, countries, type IsoCountry, usStates } from 'helpers/internationalisation/country';
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { type Option } from 'helpers/types/option';

import { Outset } from 'components/content/content';
import CheckoutCopy from 'components/checkoutCopy/checkoutCopy';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { Fieldset } from 'components/forms/standardFields/fieldset';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withError } from 'components/forms/formHOCs/withError';
import { asControlled } from 'components/forms/formHOCs/asControlled';
import { canShow } from 'components/forms/formHOCs/canShow';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import Checkout from 'components/checkout/checkout';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import Content from 'components/content/content';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';

import {
  type FormActionCreators,
  formActionCreators,
  signOut,
  type FormField,
  type FormFields,
  getFormFields,
  type State,
} from '../paperSubscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...getFormFields(state),
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
  };
}

// ----- Form Fields ----- //

const InputWithLabel = withLabel(Input);
const Input1 = compose(asControlled, withError)(InputWithLabel);
const Select1 = compose(asControlled, withError, withLabel)(Select);
const Select2 = canShow(Select1);

function statesForCountry(country: Option<IsoCountry>): React$Node {

  switch (country) {
    case 'US':
      return sortedOptions(usStates);
    case 'CA':
      return sortedOptions(caStates);
    default:
      return null;
  }

}


// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  const errorHeading = props.submissionError === 'personal_details_incorrect' ? 'Failed to Create Subscription' :
    'Payment Attempt Failed';
  const errorState = props.submissionError ?
    <GeneralErrorMessage errorReason={props.submissionError} errorHeading={errorHeading} /> :
    null;

  return (
    <Content modifierClasses={['your-details']}>
      <Outset>
        <Checkout>
          <Form onSubmit={(ev) => {
            ev.preventDefault();
            props.submitForm();
          }}
          >
            <FormSection title="Your details">
              <Input1
                id="first-name"
                label="First name"
                type="text"
                value={props.firstName}
                setValue={props.setFirstName}
                error={firstError('firstName', props.formErrors)}
              />
              <Input1
                id="last-name"
                label="Last name"
                type="text"
                value={props.lastName}
                setValue={props.setLastName}
                error={firstError('lastName', props.formErrors)}
              />
              <InputWithLabel
                id="email"
                label="Email"
                type="email"
                disabled
                value={props.email}
                footer={(
                  <span>
                    <CheckoutExpander copy="Want to use a different email address?">
                      <p>You will be able to edit this in your account once you have completed this checkout.</p>
                    </CheckoutExpander>
                    <CheckoutExpander copy="Not you?">
                      <p>
                        <Button
                          appearance="greyHollow"
                          icon={null}
                          type="button"
                          aria-label={null}
                          onClick={() => props.signOut()}
                        >
                          Sign out
                        </Button> and create a new account.
                      </p>
                    </CheckoutExpander>
                  </span>
                )}
              />
              <Input1
                id="telephone"
                label="Telephone (optional)"
                type="tel"
                value={props.telephone}
                setValue={props.setTelephone}
                footer="We may use this to get in touch with you about your subscription."
                error={firstError('telephone', props.formErrors)}
              />
            </FormSection>
            <FormSection title="Address">
              <Input1
                id="address-line-1"
                label="Address Line 1"
                type="text"
                value={props.addressLine1}
                setValue={props.setAddressLine1}
                error={firstError('addressLine1', props.formErrors)}
              />
              <Input1
                id="address-line-2"
                label="Address Line 2 (optional)"
                type="text"
                value={props.addressLine2}
                setValue={props.setAddressLine2}
                error={firstError('addressLine2', props.formErrors)}
              />
              <Input1
                id="town-city"
                label="Town/City"
                type="text"
                value={props.townCity}
                setValue={props.setTownCity}
                error={firstError('townCity', props.formErrors)}
              />
              <Select1
                id="country"
                label="Country"
                value={props.country}
                setValue={props.setBillingCountry}
                error={firstError('country', props.formErrors)}
              >
                <option value="">--</option>
                {sortedOptions(countries)}
              </Select1>
              <Select2
                id="stateProvince"
                label={props.country === 'CA' ? 'Province/Territory' : 'State'}
                value={props.stateProvince}
                setValue={props.setStateProvince}
                error={firstError('stateProvince', props.formErrors)}
                isShown={props.country === 'US' || props.country === 'CA'}
              >
                <option value="">--</option>
                {statesForCountry(props.country)}
              </Select2>
              <Input1
                id="county"
                label="County (optional)"
                type="text"
                value={props.county}
                setValue={props.setCounty}
                error={firstError('county', props.formErrors)}
              />
              <Input1
                id="postcode"
                label="Postcode"
                type="text"
                value={props.postcode}
                setValue={props.setPostcode}
                error={firstError('postcode', props.formErrors)}
              />
            </FormSection>
            <FormSection title={props.countrySupportsDirectDebit ? 'How would you like to pay?' : null}>
              {props.countrySupportsDirectDebit &&
              <div>
                <Fieldset legend="How would you like to pay?">
                  <RadioInput
                    text="Direct debit"
                    name="paymentMethod"
                    checked={props.paymentMethod === 'DirectDebit'}
                    onChange={() => props.setPaymentMethod('DirectDebit')}
                  />
                  <RadioInput
                    text="Credit/Debit card"
                    name="paymentMethod"
                    checked={props.paymentMethod === 'Stripe'}
                    onChange={() => props.setPaymentMethod('Stripe')}
                  />
                </Fieldset>
              </div>
              }
              <CheckoutCopy
                strong="Money Back Guarantee."
                copy="If you wish to cancel your subscription, we will send you a refund of the unexpired part of your subscription."
              />
              <CheckoutCopy
                strong="Cancel any time you want."
                copy="There is no set time on your agreement so you can stop your subscription anytime."
              />
              <DirectDebitPopUpForm
                onPaymentAuthorisation={(pa: PaymentAuthorisation) => {
                  props.onPaymentAuthorised(pa);
                }}
              />
            </FormSection>
            <FormSection>
              {errorState}
              <Button aria-label={null} type="submit">Continue to payment</Button>
            </FormSection>
          </Form>
        </Checkout>
      </Outset>
    </Content>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, {
  ...formActionCreators,
  signOut,
})(CheckoutForm);