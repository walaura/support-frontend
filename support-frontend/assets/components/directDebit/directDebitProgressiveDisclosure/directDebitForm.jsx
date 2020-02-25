// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import {
  type Action,
  type Phase,
  confirmDirectDebitClicked,
  payDirectDebitClicked,
  setDirectDebitFormPhase,
  updateAccountHolderName,
  updateAccountNumber,
  updateSortCodeString,
  updateAccountHolderConfirmation,
} from 'components/directDebit/directDebitActions';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import './directDebitForm.scss';
import type { ErrorReason } from 'helpers/errorReasons';
import Form from './components/form';
import Playback from './components/playback';


// ---- Types ----- //

type PropTypes = {|
  /* eslint-disable react/no-unused-prop-types */
  buttonText: string,
  cardError: ErrorReason | null,
  cardErrorHeading: string,
  allErrors: Array<Object>,
  sortCodeString: string,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountNumber: (accountNumber: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderName: (accountHolderName: SyntheticInputEvent<HTMLInputElement>) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: SyntheticInputEvent<HTMLInputElement>) => void,
  formError: string,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  submitForm: Function,
  validateForm: Function,
  payDirectDebitClicked: () => void,
  editDirectDebitClicked: () => void,
  confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => void,
  countryGroupId: CountryGroupId,
  phase: Phase,
|};

type StateTypes = {
  accountHolderName: Object,
  sortCodeString: Object,
  accountNumber: Object,
  accountHolderConfirmation: Object,
}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    sortCodeString: state.page.directDebit.sortCodeString,
    accountNumber: state.page.directDebit.accountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
    formError: state.page.directDebit.formError,
    countryGroupId: state.common.internationalisation.countryGroupId,
    phase: state.page.directDebit.phase,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    payDirectDebitClicked: () => {
      dispatch(payDirectDebitClicked());
      return false;
    },
    editDirectDebitClicked: () => {
      dispatch(setDirectDebitFormPhase('entry'));
    },
    confirmDirectDebitClicked: (onPaymentAuthorisation: PaymentAuthorisation => void) => {
      dispatch(confirmDirectDebitClicked(onPaymentAuthorisation));
      return false;
    },
    updateSortCodeString: (event: SyntheticInputEvent<HTMLInputElement>) => {
      dispatch(updateSortCodeString(event.target.value));
    },
    updateAccountNumber: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountNumber: string = event.target.value;
      dispatch(updateAccountNumber(accountNumber));
    },
    updateAccountHolderName: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderName: string = event.target.value;
      dispatch(updateAccountHolderName(accountHolderName));
    },
    updateAccountHolderConfirmation: (event: SyntheticInputEvent<HTMLInputElement>) => {
      const accountHolderConfirmation: boolean = event.target.checked;
      dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
    },
  };

}

const fieldNames = [
  'accountHolderName',
  'sortCodeString',
  'accountNumber',
  'accountHolderConfirmation',
];


// ----- Component ----- //

class DirectDebitForm extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      accountHolderName: {
        error: '',
        message: 'Please enter a valid account name',
        // Regex matches a string with any character that is not a digit
        rule: accountHolderName => accountHolderName.match(/^\D+$/),
      },
      sortCodeString: {
        error: '',
        message: 'Please enter a valid sort code',
        // Regex matches a string with exactly 6 digits
        rule: sortCodeString => sortCodeString.match(/^\d{6}$/),
      },
      accountNumber: {
        error: '',
        message: 'Please enter a valid account number',
        // Regex matches a string with between 6 and 10 digits
        rule: accountNumber => accountNumber.match(/^\d{6,10}$/),
      },
      accountHolderConfirmation: {
        error: '',
        message: 'Please confirm you are the account holder',
        rule: accountHolderConfirmation => accountHolderConfirmation === true,
      },
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { props } = this;
    this.handleErrorsAndCheckAccount();
    props.validateForm();
  }

  onChange = (field, dispatchUpdate, event) => {
    this.setState({
      [field]: {
        ...this.state[field],
        error: '',
      },
    });
    dispatchUpdate(event);
  }

  getAccountErrors = () => {
    const { state } = this;
    const cardErrors = fieldNames.map(field =>
      ({ message: state[field].error }));
    return cardErrors;
  }

  getAccountErrorsLength = (cardErrors) => {
    let accum = 0;
    cardErrors.forEach((item) => {
      if ((item.message).length > 0) {
        accum += 1;
      }
    });
    return accum;
  }

  handleErrorsAndCheckAccount = () => {
    const { props } = this;
    let accountErrorsLength = 0;
    fieldNames.forEach((field) => {
      if (!this.state[field].rule(props[field])) {
        this.setState(
          state => ({
            [field]: {
              ...state[field],
              error: this.state[field].message,
            },
          }),
          () => {
            accountErrorsLength = this.getAccountErrorsLength(this.getAccountErrors());
          },
        );
      } else {
        accountErrorsLength = this.getAccountErrorsLength(this.getAccountErrors());
        if (props.allErrors.length === 0 && accountErrorsLength === 0) {
          props.payDirectDebitClicked();
        }
      }
    });
  }

  submitForm = () => {
    const { props } = this;
    props.confirmDirectDebitClicked(props.onPaymentAuthorisation);
    props.submitForm();
  }

  render() {
    const { props, state } = this;
    const accountErrors = this.getAccountErrors();
    const accountErrorsLength = this.getAccountErrorsLength(accountErrors);
    const showGeneralError = props.allErrors.length === 0 && accountErrorsLength === 0 &&
    (props.formError || props.formError);

    return (
      <span>
        {props.phase === 'entry' && (
          <Form
            {...props}
            showGeneralError={showGeneralError}
            accountErrors={accountErrors}
            accountErrorsLength={accountErrorsLength}
            accountHolderNameError={state.accountHolderName.error}
            accountNumberError={state.accountNumber.error}
            sortCodeError={state.sortCodeString.error}
            accountHolderConfirmationError={state.accountHolderConfirmation.error}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
        )}
        {props.phase === 'confirmation' && (
          <Playback
            editDirectDebitClicked={props.editDirectDebitClicked}
            submitForm={this.submitForm}
            accountHolderName={props.accountHolderName}
            accountNumber={props.accountNumber}
            sortCodeString={props.sortCodeString}
          />
        )}
      </span>
    );
  }
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);
