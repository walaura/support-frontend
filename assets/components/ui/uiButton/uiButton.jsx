// @flow

// ----- Imports ----- //

import React from 'react';

import DangerouslySetButtonOnAnyElement, { defaultProps, type PropTypes } from './dangerouslySetButtonOnAnyElement';
import './uiButton.scss';

// ----- Render ----- //

type AllPropTypes = {
  ...PropTypes,
};

const UiButton = (props: AllPropTypes) => (
  <DangerouslySetButtonOnAnyElement
    element="button"
    {...props}
  />
);

UiButton.defaultProps = {
  ...defaultProps,
};

export default UiButton;
