// @flow
import React from 'react';
import { MapGroup } from 'pages/aus-moment-map/components/mapGroup';

export const AustralianCapitalTerritory = () => {
  const name = 'ACT';
  const labelContrast = false;
  const labelPath = 'M634.687 504.66V505H630.787V504.66L632.327 503.68L636.687 490.58H639.127L643.727 503.84L644.947 504.66V505H638.107V504.66L639.427 504.12L638.127 500.26H633.867L632.747 503.7L634.687 504.66ZM635.927 494.04L634.027 499.8H637.967L636.027 494.04H635.927ZM652.438 504.9C652.572 504.9 652.698 504.887 652.818 504.86C652.938 504.833 653.052 504.787 653.158 504.72L656.238 500.06H656.578L656.418 504.48C656.005 504.693 655.438 504.873 654.718 505.02C653.998 505.167 653.145 505.24 652.158 505.24C651.092 505.24 650.098 505.107 649.178 504.84C648.272 504.56 647.485 504.127 646.818 503.54C646.165 502.953 645.652 502.193 645.278 501.26C644.905 500.313 644.718 499.18 644.718 497.86C644.718 496.473 644.932 495.3 645.358 494.34C645.785 493.367 646.345 492.587 647.038 492C647.745 491.413 648.552 490.993 649.458 490.74C650.378 490.473 651.312 490.34 652.258 490.34C653.138 490.34 653.925 490.387 654.618 490.48C655.312 490.56 655.872 490.68 656.298 490.84L656.438 495.22H656.098L653.158 490.84C653.025 490.787 652.892 490.747 652.758 490.72C652.638 490.693 652.512 490.68 652.378 490.68C651.352 490.68 650.565 491.22 650.018 492.3C649.472 493.367 649.198 495.127 649.198 497.58C649.198 500.193 649.458 502.067 649.978 503.2C650.498 504.333 651.318 504.9 652.438 504.9ZM660.209 505V504.66L661.689 504.36V490.96H660.549L657.749 495.58H657.409L657.589 490.58H669.989L670.149 495.58H669.809L667.089 490.96H665.909V504.36L667.389 504.66V505H660.209Z';
  const mapPaths = [
    'M597.6 491.699L594 493.699L593 496.399V498.999L594.4 499.599V502.399L594.6 502.099L595.7 498.299L596.3 494.699L598.2 492.699H598.3H598.2L597.6 491.699Z',
  ];

  return (
    <MapGroup
      name={name}
      labelContrast={labelContrast}
      labelPath={labelPath}
      mapPaths={mapPaths}
    />
  );
};
