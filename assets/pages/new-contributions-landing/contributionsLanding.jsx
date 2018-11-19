// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { isDetailsSupported, polyfillDetails } from 'helpers/details';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import * as user from 'helpers/user/user';
import { set as setCookie } from 'helpers/cookie';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { NewHeader } from 'components/headers/new-header/Header';
import { getSession } from 'helpers/storage';

import { init as formInit } from './contributionsLandingInit';
import { initReducer } from './contributionsLandingReducer';
import { NewContributionFormContainer } from './components/ContributionFormContainer';
import ContributionThankYouContainer from './components/ContributionThankYouContainer';
import { NewContributionBackground } from './components/ContributionBackground';

if (!isDetailsSupported) {
  polyfillDetails();
}

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(initReducer(countryGroupId), true);

user.init(store.dispatch);
formInit(store);

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroup = countryGroups[countryGroupId];

const { smallMobileHeaderNotEpicOrBanner } = store.getState().common.abParticipations;

const isFromEpicOrBanner = [
  'ACQUISITIONS_EPIC',
  'ACQUISITIONS_ENGAGEMENT_BANNER',
].some((componentType: string) => {
  // Try from session storage first. This is so that we get the correct header
  // on subsequent pageviews which don't have the componentType in the URL, e.g.
  // thank you page after PayPal one-off, or after changing country dropdown.
  const searchString = getSession('acquisitionData') || window.location.href;
  return searchString.includes(componentType);
});

let extraClasses = [];
if (smallMobileHeaderNotEpicOrBanner) {
  extraClasses = smallMobileHeaderNotEpicOrBanner.split('_').filter(x => x !== 'control' && x !== 'notintest');
} else if (isFromEpicOrBanner) {
  extraClasses = ['shrink', 'no-blurb', 'no-header'];
}

// ----- Render ----- //

const ONE_OFF_CONTRIBUTION_COOKIE = 'gu.contributions.contrib-timestamp';
const currentTimeInEpochMilliseconds: number = Date.now();

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute"
          render={() => (
            <Page
              classModifiers={['contribution-form', ...extraClasses]}
              header={<NewHeader selectedCountryGroup={selectedCountryGroup} />}
              footer={<Footer disclaimer countryGroupId={countryGroupId} />}
            >
              <NewContributionFormContainer
                thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou`}
              />
              <NewContributionBackground />
            </Page>
          )}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/thankyou"
          render={() => {
            setCookie(
              ONE_OFF_CONTRIBUTION_COOKIE,
              currentTimeInEpochMilliseconds.toString(),
            );
            return (
              <Page
                classModifiers={['contribution-thankyou', ...extraClasses]}
                header={<NewHeader />}
                footer={<Footer disclaimer countryGroupId={countryGroupId} />}
              >
                <ContributionThankYouContainer />
                <NewContributionBackground />
              </Page>
            );
          }}
        />
      </div>
    </Provider>
  </BrowserRouter>
);

renderPage(router, reactElementId);
