// @flow

// ----- NOTE ----- //
// This code is designed to work with a single image at one or more crops
// If you want to work with multiple (different) images, maybe try gridPicture instead

// ----- Imports ----- //

import React, { type Node } from 'react';

import { gridUrl, gridSrcset } from 'helpers/theGrid';
import { ascending } from 'helpers/utilities';
import { classNameWithModifiers } from 'helpers/utilities';

import type { ImageType, ImageId } from 'helpers/theGrid';


// ----- Constants ----- //

const MIN_IMG_WIDTH = 300;


// ----- Types ----- //

export type GridImg = {
  gridId: ImageId,
  srcSizes: number[],
  sizes: string,
  altText: string,
  imgType?: ImageType,
  classModifiers?: Array<?string>,
}

type PropTypes = GridImg;


// ----- Component ----- //

export default function GridImage(props: PropTypes): Node {
  if (props.srcSizes.length < 1) {
    return null;
  }

  const sorted = props.srcSizes.sort(ascending);
  const srcSet = gridSrcset(props.gridId, sorted, props.imgType);

  const fallbackSize = sorted.find(_ => _ > MIN_IMG_WIDTH) || sorted[0];
  const fallbackSrc = gridUrl(props.gridId, fallbackSize, props.imgType);

  return (
    <img
      className={classNameWithModifiers('component-grid-image', props.classModifiers || [])}
      sizes={props.sizes}
      srcSet={srcSet}
      src={fallbackSrc}
      alt={props.altText}
    />
  );

}


// ----- Default Props ----- //

GridImage.defaultProps = {
  imgType: 'jpg',
  altText: '',
  classModifiers: [],
};
