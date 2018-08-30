// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type Contrib } from 'helpers/contributions';
import { getPaymentDescription, type PaymentMethod } from 'helpers/checkouts';

import SvgArrowRight from 'components/svgs/arrowRightStraight';

import { formatAmount } from './ContributionAmount';
import { type CountryMetaData } from '../contributionsLandingMetadata';

// ----- Types ----- //

type PropTypes = {
  selectedCountryGroupDetails: CountryMetaData,
  contributionType: Contrib,
  selectedAmounts: Array<{ value: string, spoken: string }>,
  paymentMethod: PaymentMethod,
};

// ----- Render ----- //

function ContributionSubmit(props: PropTypes) {
  return (
    <div className="form__submit">
      <button className="form__submit__button" type="submit">
        Contribute&nbsp;
        {formatAmount(props.selectedCountryGroupDetails, props.selectedAmounts[0], false)}&nbsp;
        {getFrequency(props.contributionType)}&nbsp;
        {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
        <SvgArrowRight />
      </button>
    </div>
  );
}

const NewContributionSubmit = connect()(ContributionSubmit);

export { NewContributionSubmit };