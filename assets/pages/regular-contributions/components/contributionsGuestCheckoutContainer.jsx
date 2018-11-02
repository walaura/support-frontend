// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Contrib } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { checkoutFormShouldSubmit, getForm } from 'helpers/checkoutForm/checkoutForm';
import ContributionsGuestCheckout from './contributionsGuestCheckout';
import { type State } from '../regularContributionsReducer';
import { setStage } from '../helpers/checkoutForm/checkoutFormActions';
import { type Action as CheckoutAction, setCheckoutFormHasBeenSubmitted } from '../helpers/checkoutForm/checkoutFormActions';
import { formClassName } from './formFields';

// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    displayName: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
    stage: state.page.checkoutForm.stage,
    userTypeFromIdentityResponse: state.page.regularContrib.userTypeFromIdentityResponse,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<CheckoutAction>) => ({
  onBackClick: () => {
    dispatch(setStage('checkout'));
  },
  onNextButtonClick: (
    contributionType: Contrib,
    isSignedIn: boolean,
    userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  ) => {
    if (checkoutFormShouldSubmit(
      contributionType,
      isSignedIn,
      userTypeFromIdentityResponse,
      getForm(formClassName),
    )) {
      dispatch(setStage('payment'));
    }
    dispatch(setCheckoutFormHasBeenSubmitted());
  },
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsGuestCheckout);