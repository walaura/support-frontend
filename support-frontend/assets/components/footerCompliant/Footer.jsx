// @flow

// ----- Imports ----- //

import React, { Children, type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link, linkBrand } from '@guardian/src-link';

import ContribLegal from 'components/legal/contribLegal/contribLegal';
import { privacyLink, copyrightNotice } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { backToTopLink, componentFooter, copyright, linksList, link } from './footerStyles';
import FooterContent from './containers/FooterContent';
import { BackToTop } from './BackToTop';

// ----- Props ----- //

type PropTypes = {|
  privacyPolicy: boolean,
  disclaimer: boolean,
  faqsLink: string,
  termsConditionsLink: string,
  countryGroupId: CountryGroupId,
  children: Node,
|};


// ----- Component ----- //

function Footer({
  disclaimer, privacyPolicy, children, countryGroupId, faqsLink, termsConditionsLink,
}: PropTypes) {
  return (
    <footer css={componentFooter} role="contentinfo">
      {(disclaimer || privacyPolicy || Children.count(children) > 0) &&
        <FooterContent border paddingTop>
          <div>
            <Rows>
              {privacyPolicy &&
              <div className="component-footer__privacy-policy-text">
                To find out what personal data we collect and how we use it, please visit our
                <a href={privacyLink}> Privacy Policy</a>.
              </div>
              }
              {children}
              {disclaimer && <ContribLegal countryGroupId={countryGroupId} />}
            </Rows>
          </div>
        </FooterContent>
      }
      <FooterContent border>
        <ThemeProvider theme={linkBrand}>
          <ul css={linksList}>
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/privacy-policy">Privacy Policy</Link>
            </li>
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/contact-us">Contact us</Link>
            </li>
            <li css={link}>
              <Link subdued href={faqsLink}>FAQs</Link>
            </li>
            {termsConditionsLink &&
              <li css={link}>
                <Link subdued href={termsConditionsLink}>Terms & Conditions</Link>
              </li>
            }
          </ul>
        </ThemeProvider>
      </FooterContent>
      <FooterContent paddingTop>
        <div css={backToTopLink}>
          <BackToTop />
        </div>
        <span css={copyright}>{copyrightNotice}</span>
      </FooterContent>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  privacyPolicy: false,
  disclaimer: false,
  faqsLink: 'https://www.theguardian.com/help',
  termsConditionsLink: '',
  countryGroupId: GBPCountries,
  children: [],
};


// ----- Exports ----- //

export default Footer;