// @flow

// ----- Imports ----- //
// $FlowIgnore - required for hooks
import React, { Children, useEffect, type Node } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Link, ButtonLink, linkBrand } from '@guardian/src-link';
import { getGlobal } from 'helpers/globals';
import { copyrightNotice } from 'helpers/legal';

import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

import { backToTopLink, componentFooter, copyright, linksList, link } from './footerStyles';
import FooterContent from './containers/FooterContent';
import { BackToTop } from './BackToTop';

// ----- Props ----- //

type PropTypes = {|
  centred: boolean,
  faqsLink: string,
  termsConditionsLink: string,
  children: Node,
|};


// ----- Component ----- //

function Footer({
  centred, children, faqsLink, termsConditionsLink,
}: PropTypes) {
  let consentManagementPlatform;

  function showPrivacyManager() {
    if (consentManagementPlatform) {
      consentManagementPlatform.showPrivacyManager();
    }
  }

  useEffect(() => {
    if (!getGlobal('ssr')) {
      import('@guardian/consent-management-platform').then(({ cmp }) => {
        consentManagementPlatform = cmp;
      });
    }
  }, []);

  return (
    <footer css={componentFooter} role="contentinfo">
      <ThemeProvider theme={linkBrand}>
        {(Children.count(children) > 0) &&
        <FooterContent appearance={{ border: true, paddingTop: true, centred }}>
          <div>
            <Rows>
              {children}
            </Rows>
          </div>
        </FooterContent>
      }
        <FooterContent appearance={{ border: true, centred }}>
          <ul css={linksList}>
            {faqsLink &&
              <li css={link}>
                <Link subdued href={faqsLink}>FAQs</Link>
              </li>
            }
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/contact-us">Contact us</Link>
            </li>
            <li css={link}>
              <Link subdued href="https://www.theguardian.com/help/privacy-policy">Privacy Policy</Link>
            </li>
            <li css={link}>
              <ButtonLink subdued onClick={showPrivacyManager}>Privacy Settings</ButtonLink>
            </li>
            {termsConditionsLink &&
              <li css={link}>
                <Link subdued href={termsConditionsLink}>Terms & Conditions</Link>
              </li>
            }
          </ul>
        </FooterContent>
        <FooterContent appearance={{ centred }}>
          <div css={backToTopLink}>
            <BackToTop />
          </div>
          <span css={copyright}>{copyrightNotice}</span>
        </FooterContent>
      </ThemeProvider>
    </footer>
  );

}


// ----- Default Props ----- //

Footer.defaultProps = {
  centred: false,
  faqsLink: '',
  termsConditionsLink: '',
  children: [],
};


// ----- Exports ----- //

export default Footer;
