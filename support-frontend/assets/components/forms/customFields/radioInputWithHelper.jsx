// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './radioInput.scss';

// ----- Types ----- //

type PropTypes = {
  text: Node | string,
  offer?: Option<string>,
  helper: string,
  appearance: 'normal' | 'group',
  image?: Node,
};

// ----- Component ----- //

function RadioInputWithHelper({
  text, offer, helper, appearance, image, ...otherProps
}: PropTypes) {
  return (
    <label className={classNameWithModifiers('component-radio-input--with-helpers', [appearance])}>
      <input className="component-radio-input__input" type="radio" {...otherProps} />
      <div className="component-radio-input__text">{text}</div>
      <p className="component-radio-input__helper">
        {offer ? <span className="component-radio-input__offer">{offer}<br /></span> : ''} {helper}
      </p>
      <span className="component-radio-input__image">{image}</span>
    </label>
  );
}

// ----- Exports ----- //

RadioInputWithHelper.defaultProps = {
  appearance: 'normal',
  image: null,
  offer: '',
};
export { RadioInputWithHelper };
