// @flow

// ----- Imports ----- //

import React from 'react';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

// ----- Props ----- //

type PropTypes = {|
  subscriptionProduct: SubscriptionProduct,
|};

// ----- Functions ----- //

function faqLink(props: PropTypes) {
  if (props.subscriptionProduct === 'GuardianWeekly') {
    return 'https://www.theguardian.com/help/2012/jan/19/guardian-weekly-faqs';
  }

  return 'https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions';
}

// ----- Component ----- //

function SubscriptionFaq(props: PropTypes) {
  return (
    <div className="component-subscription-faq">
      <div className="component-subscription-faq__text">
        You may also find help in our <a className="component-subscription-faq__href" href={faqLink(props)} onClick={sendTrackingEventsOnClick('onward_faq', props.subscriptionProduct, null)}>Frequently Asked Questions</a>.
      </div>
    </div>
  );
}


// ----- Exports ----- //

export default SubscriptionFaq;
