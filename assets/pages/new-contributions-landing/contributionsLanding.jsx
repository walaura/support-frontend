// @flow

// ----- Imports ----- //

import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButtonNewFlow';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { loadPayPalExpress } from 'helpers/paymentIntegrations/payPalExpressCheckout';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { isDetailsSupported, polyfillDetails } from 'helpers/details';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import * as user from 'helpers/user/user';
import { set as setCookie } from 'helpers/cookie';
import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import { NewHeader } from 'components/headers/new-header/Header';

import { init as formInit } from './contributionsLandingInit';
import { initReducer } from './contributionsLandingReducer';
import { NewContributionForm } from './components/ContributionForm';
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

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];
const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const ONE_OFF_CONTRIBUTION_COOKIE = 'gu.contributions.contrib-timestamp';
const currentTimeInEpochMilliseconds: number = Date.now();

const csrf = store.getState().page.csrf;
const payPalHasLoaded = store.getState().page.form.payPalHasLoaded;
const payPalSwitchStatus = store.getState().common.settings.switches.recurringPaymentMethods.payPal;
const paymentMethod = store.getState().page.form.paymentMethod;
const showPayPalExpressButton = paymentMethod === 'PayPal';
const formClassName = 'form--contribution';

loadPayPalExpress().then( x => {

const router = (
  <BrowserRouter>
    <Provider store={store}>
      <div>
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/contribute.new"
          render={() => (
            <Page
              classModifiers={['contribution-form']}
              header={<NewHeader selectedCountryGroup={selectedCountryGroup} />}
              footer={<Footer disclaimer countryGroupId={countryGroupId} />}
            >
              <NewContributionForm
                selectedCountryGroupDetails={selectedCountryGroupDetails}
                thankYouRoute={`/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou.new`}
              />
              <PayPalExpressButton
                amount={5}
                currencyId={"USD"}
                csrf={csrf}
                onPaymentAuthorisation={() => alert("worked")}
                hasLoaded={payPalHasLoaded}
                setHasLoaded={() => {}}
                switchStatus={payPalSwitchStatus}
                canOpen={() => formIsValid(formClassName)}
                formClassName={formClassName}
                whenUnableToOpen={() => {}}
                show={true}
              />
              <NewContributionBackground />
            </Page>
          )}
        />
        <Route
          exact
          path="/:countryId(uk|us|au|eu|int|nz|ca)/thankyou.new"
          render={() => {
            setCookie(
              ONE_OFF_CONTRIBUTION_COOKIE,
              currentTimeInEpochMilliseconds.toString(),
            );
            return (
              <Page
                classModifiers={['contribution-thankyou']}
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

renderPage(router, reactElementId)
}
);
