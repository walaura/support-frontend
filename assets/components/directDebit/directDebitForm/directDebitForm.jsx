// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Currency } from 'helpers/internationalisation/currency';
import { updateSortCode, updateAccountNumber, updateAccountHolderName, updateAccountHolderConfirmation } from 'components/directDebit/directDebitActions';


// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  currency: Currency,
  isTestUser: boolean,
  sortCode: string,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateSortCode: (sortCode: string) => void,
  updateAccountNumber: (accountNumber: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.directDebit.isPopUpOpen,
    sortCode: state.page.directDebit.bankSortCode,
    accountNumber: state.page.directDebit.bankAccountNumber,
    accountHolderName: state.page.directDebit.accountHolderName,
    accountHolderConfirmation: state.page.directDebit.accountHolderConfirmation,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    updateSortCode: (sortCode: string) => {
      dispatch(updateSortCode(sortCode));
    },
    updateAccountNumber: (accountNumber: string) => {
      dispatch(updateAccountNumber(accountNumber));
    },
    updateAccountHolderName: (accountHolderName: string) => {
      dispatch(updateAccountHolderName(accountHolderName));
    },
    updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => {
      dispatch(updateAccountHolderConfirmation(accountHolderConfirmation));
    },
  };

}

// ----- Component ----- //

const DirectDebitForm = (props: PropTypes) => (
  <div className="component-direct-debit-form">
    <dd className="component-direct-debit-form__direct-debit-logo">
      <img src="#" alt="The Direct Debit logo" />
    </dd>

    <SortCodeInput
      value={props.sortCode}
      onChange={props.updateSortCode}
    />

    <AccountNumberInput
      onChange={props.updateAccountNumber}
      value={props.accountNumber}
    />

    <AccountHolderNameInput
      onChange={props.updateAccountHolderName}
      value={props.accountHolderName}
    />

    <ConfirmationInput
      checked={props.accountHolderConfirmation}
      onChange={props.updateAccountHolderConfirmation}
    />

    <dt className="component-direct-debit-form__advance-notice__title">
        Advance notice
    </dt>
    <dd className="component-direct-debit-form__advance-notice__content">
      <div>
        <p>The details of your Direct Debit instruction including payment schedule, due date,
          frequency and amount will be sent to you within three working days. All the normal
          Direct Debit safeguards and guarantees apply.
        </p>
        <p>
          Your payments are protected by the <a target="_blank" rel="noopener noreferrer" href="https://www.directdebit.co.uk/DirectDebitExplained/pages/directdebitguarantee.aspx">Direct Debit guarantee</a>.
        </p>
        <div>
          <div>The Guardian, Unit 16, Coalfield Way, Ashby Park, Ashby-De-La-Zouch, LE65 1JT
            United Kingdom
          </div>
          <div>Tel: +44 (0) 330 333 6767</div>
          <div><a href="mailto:support@theguardian.com">support@theguardian.com</a></div>
        </div>
      </div>
    </dd>
  </div>);

// ----- Default Props ----- //

DirectDebitForm.defaultProps = {

};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitForm);


function SortCodeInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input">
        Sort code
        <input
          id="sort-code-input"
          value={props.value}
          onChange={props.onChange}
          type="text"
          placeholder="00-00-00"
        />
      </label>
    </div>
  );
}


function AccountNumberInput(props: {onChange: Function, value: string}) {
  return (
    <div className="component-direct-debit-form__account-number">
      <label htmlFor="account-number-input">
        Account number
        <input
          id="account-number-input"
          value={props.value}
          onChange={props.onChange}
          pattern="[0-9]*"
          minLength="6"
          maxLength="10"
        />
      </label>
    </div>
  );
}

/*
 * BACS requirement:
 "The payer’s account name (maximum of 18 characters).
 This must be the name of the person who is paying the Direct Debit
 and has signed the Direct Debit Instruction (DDI)."
 http://www.bacs.co.uk/Bacs/Businesses/Resources/Pages/Glossary.aspx
 * */
function AccountHolderNameInput(props: {value: string, onChange: Function}) {
  return (
    <div className="component-direct-debit-form__account-holder-name">
      <label htmlFor="account-holder-name-input">
        Account holder name
        <input
          id="account-holder-name-input"
          value={props.value}
          onChange={props.onChange}
          maxLength="18"
        />
      </label>
    </div>
  );
}

function ConfirmationInput(props: { checked: boolean, onChange: Function }) {
  return (
    <div>
      <dt className="mma-section__list--title">
        Confirmation
      </dt>
      <dd className="mma-section__list--content">
        <div className="mma-section__list--restricted">
          <label className="option" htmlFor="confirmation-input">
            <span className="option__input">
              <input
                id="confirmation-input"
                type="checkbox"
                onChange={props.onChange}
                checked={props.checked}
              />
            </span>
            <span>
              I confirm that I am the account holder and I am solely able to authorise debit from
              the account
            </span>
          </label>
        </div>
      </dd>
    </div>
  );
}
