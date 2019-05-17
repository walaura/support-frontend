// @flow

import type { Dispatch } from 'redux';
import { type Action, setFormErrors } from 'helpers/subscriptionsForms/formActions';
import type { FormField, FormFields } from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { FormField as AddressFormField } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import {
  applyAddressRules as getAddressFormErrors,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { formError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingAddressFields } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

function getErrors(fields: FormFields): FormError<FormField>[] {
  return validate([
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a value.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a value.'),
    },
    {
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ]);
}

const formIsValid = (state: CheckoutState): boolean => getErrors(getFormFields(state)).length === 0 &&
    getAddressFormErrors(getBillingAddressFields(state)).length === 0;

function validateForm(dispatch: Dispatch<Action>, state: CheckoutState) {
  type Error<T> = {
    errors: FormError<T>[],
    dispatcher: any => Action,
  }

  const allErrors: (Error<AddressFormField> | Error<FormField>)[] = [
    ({
      errors: getErrors(getFormFields(state)),
      dispatcher: setFormErrors,
    }: Error<FormField>),
    ({
      errors: getAddressFormErrors(getBillingAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  const valid = allErrors.length === 0;

  if (!valid) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  }
  return valid;
}

export { validateForm, formIsValid };
