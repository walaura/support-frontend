// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';

import uuidv4 from 'uuid';

import './productPagePlanFormLabel.scss';

// ---- Types ----- //

type PropTypes = {|
  type: string,
  title: string,
  offer: string | null,
  children: Node,
  checked: boolean,
  onChange: (Event) => void,
|};


// ----- Render ----- //

export default ({
  type, title, offer, children, checked, onChange,
}: PropTypes) => {
  const id = uuidv4();
  return (
    <label onChange={onChange} htmlFor={id} className="component-product-page-plan-form-label">
      <input checked={checked} className="component-product-page-plan-form-label__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="component-product-page-plan-form-label__box">
        <div className="component-product-page-plan-form-label__title">
          {title}
          <div aria-hidden="true" className="component-product-page-plan-form-label__check"><SvgCheckmark /></div>
        </div>
        <div className="component-product-page-plan-form-label__copy">
          {offer && <strong className="component-product-page-plan-form-label__offer">{offer}</strong>}
          <div>{children}</div>
        </div>
      </div>
    </label>
  );
};