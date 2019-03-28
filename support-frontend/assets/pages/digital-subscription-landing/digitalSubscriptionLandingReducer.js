// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import promotionPopUpReducer, { type FindOutMoreState } from './components/promotionPopUpReducer';

export type State = {
  common: CommonState,
  page: {
    productPrices: ProductPrices,
    promotion: FindOutMoreState
  }
};


// ----- Export ----- //


  const { productPrices } = window.guardian;

  return combineReducers({
    productPrices: () => productPrices,
export default () => combineReducers({
  productPrices: getProductPrices,
  promotion: promotionPopUpReducer,
});
