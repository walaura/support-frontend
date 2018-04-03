// @flow

// ----- Imports ----- //

import type { Action, Phase } from './directDebitActions';

// ----- Setup ----- //

export type DirectDebitState = {
  isPopUpOpen: boolean,
  isDDGuaranteeOpen: boolean,
  sortCodeArray: Array<string>,
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  formError: string,
  phase: Phase
};


const initialState: DirectDebitState = {
  isPopUpOpen: false,
  isDDGuaranteeOpen: false,
  sortCodeArray: Array(3).fill(''),
  accountNumber: '',
  accountHolderName: '',
  accountHolderConfirmation: false,
  formError: '',
  phase: 'entry',
};


// ----- Reducers ----- //

const directDebitReducer = (
  state: DirectDebitState = initialState,
  action: Action,
): DirectDebitState => {

  switch (action.type) {

    case 'DIRECT_DEBIT_POP_UP_OPEN':

      return Object.assign({}, state, {
        isPopUpOpen: true,
      });

    case 'DIRECT_DEBIT_POP_UP_CLOSE':

      return Object.assign({}, state, {
        isPopUpOpen: false,
      });

    case 'DIRECT_DEBIT_GUARANTEE_OPEN':

      return Object.assign({}, state, {
        isDDGuaranteeOpen: true,
      });

    case 'DIRECT_DEBIT_GUARANTEE_CLOSE':

      return Object.assign({}, state, {
        isDDGuaranteeOpen: false,
      });

    case 'DIRECT_DEBIT_UPDATE_SORT_CODE':
      initialState.sortCodeArray[action.index] = action.partialSortCode;
      return Object.assign({}, state, {
        sortCode: initialState.sortCodeArray,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER':

      return Object.assign({}, state, {
        accountNumber: action.accountNumber,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME':

      return Object.assign({}, state, {
        accountHolderName: action.accountHolderName,
      });

    case 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION':
      return Object.assign({}, state, {
        accountHolderConfirmation: action.accountHolderConfirmation,
      });

    case 'DIRECT_DEBIT_SET_FORM_ERROR':
      return Object.assign({}, state, {
        formError: action.message,
      });

    case 'DIRECT_DEBIT_RESET_FORM_ERROR': {
      return Object.assign({}, state, {
        formError: '',
      });
    }

    case 'DIRECT_DEBIT_TRANSITION_TO_CONFIRMATION_VIEW': {
      return Object.assign({}, state, {
        phase: 'confirmation',
      });
    }

    case 'DIRECT_DEBIT_TRANSITION_TO_ENTRY_VIEW': {
      return Object.assign({}, state, {
        phase: 'entry',
      });
    }

    default:
      return state;

  }

};


// ----- Exports ----- //

export { directDebitReducer };
