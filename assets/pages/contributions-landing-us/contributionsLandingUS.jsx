// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import Contribute from 'components/contribute/contribute';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import CountrySwitcherHeaderContainer from 'reducers/contributions-landing/containers/countrySwitcherHeaderContainer';
import ContributionSelectionContainer from 'reducers/contributions-landing/containers/contributionSelectionContainer';
import ContributionPaymentCtasContainer from 'reducers/contributions-landing/containers/contributionPaymentCtasContainer';
import PayPalContributionButtonContainer from 'reducers/contributions-landing/containers/payPalContributionButtonContainer';

import { createPageReducerFor } from 'reducers/contributions-landing/contributionsLandingReducer';


// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  createPageReducerFor('UnitedStates'),
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <CountrySwitcherHeaderContainer />
      <CirclesIntroduction
        headings={['Help us deliver', 'the independent', 'journalism the', 'world needs']}
        highlights={['Support', 'The Guardian']}
      />
      <Contribute
        copy="Make a monthly commitment to support The Guardian long term or a one-time contribution
            as and when you feel like it – choose the option that suits you best."
      >
        <ContributionSelectionContainer />
        <ContributionPaymentCtasContainer
          PayPalButton={PayPalContributionButtonContainer}
        />
      </Contribute>
      <Footer disclaimer />
    </div>
  </Provider>
);

renderPage(content, 'contributions-landing-page-us');
