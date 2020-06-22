// @flow
import React from 'react';
import { MapGroup } from 'pages/aus-moment-map/components/mapGroup';

export const Victoria = () => {
  const name = 'victoria';
  const labelContrast = true;
  const labelPath = 'M490.29 526L485.23 512.46L484.27 511.92V511.58H491.05V511.92L489.65 512.42L493.09 522.4H493.19L496.11 512.88L494.27 511.92V511.58H498.07V511.92L496.53 512.92L492.53 526H490.29ZM501.12 510.36C501.64 510.36 502.094 510.54 502.48 510.9C502.867 511.26 503.06 511.707 503.06 512.24C503.06 512.773 502.867 513.22 502.48 513.58C502.094 513.927 501.64 514.1 501.12 514.1C500.587 514.1 500.134 513.927 499.76 513.58C499.387 513.22 499.2 512.773 499.2 512.24C499.2 511.707 499.387 511.26 499.76 510.9C500.134 510.54 500.587 510.36 501.12 510.36ZM498.16 515.48L502.54 514.84L503.04 514.88V525.34L504.16 525.66V526H498.24V525.66L499.38 525.34V516.3L498.16 515.82V515.48ZM510.183 526.26C509.303 526.26 508.523 526.12 507.843 525.84C507.177 525.56 506.623 525.167 506.183 524.66C505.743 524.153 505.41 523.547 505.183 522.84C504.957 522.12 504.843 521.333 504.843 520.48C504.843 518.733 505.363 517.347 506.403 516.32C507.457 515.293 508.87 514.78 510.643 514.78C511.35 514.78 512.003 514.813 512.603 514.88C513.217 514.933 513.717 515.02 514.103 515.14L514.163 518.84H513.823L511.143 515.18C511.103 515.167 511.063 515.16 511.023 515.16C510.997 515.16 510.963 515.16 510.923 515.16C510.15 515.16 509.55 515.56 509.123 516.36C508.697 517.16 508.483 518.3 508.483 519.78C508.483 521.327 508.763 522.5 509.323 523.3C509.883 524.087 510.783 524.48 512.023 524.48C512.477 524.48 512.877 524.447 513.223 524.38C513.583 524.3 513.91 524.193 514.203 524.06V524.4C513.843 524.893 513.337 525.327 512.683 525.7C512.03 526.073 511.197 526.26 510.183 526.26ZM516.573 515.8H515.013V515.44L516.573 515.04V512.88L520.213 512.3V515.04H522.633V515.8H520.213V523.08C520.213 523.64 520.32 524.047 520.533 524.3C520.746 524.54 521.153 524.66 521.753 524.66C521.94 524.66 522.12 524.653 522.293 524.64C522.48 524.613 522.633 524.587 522.753 524.56V524.9C522.433 525.233 522.006 525.54 521.473 525.82C520.953 526.087 520.366 526.22 519.713 526.22C518.673 526.22 517.886 525.96 517.353 525.44C516.833 524.92 516.573 524.073 516.573 522.9V515.8ZM528.684 526.3C527.857 526.3 527.097 526.167 526.404 525.9C525.71 525.62 525.117 525.233 524.624 524.74C524.13 524.233 523.744 523.62 523.464 522.9C523.197 522.167 523.064 521.36 523.064 520.48C523.064 519.6 523.197 518.807 523.464 518.1C523.73 517.393 524.11 516.8 524.604 516.32C525.097 515.827 525.684 515.447 526.364 515.18C527.057 514.913 527.824 514.78 528.664 514.78C529.504 514.78 530.27 514.913 530.964 515.18C531.657 515.447 532.25 515.827 532.744 516.32C533.237 516.8 533.617 517.4 533.884 518.12C534.164 518.827 534.304 519.62 534.304 520.5C534.304 521.38 534.17 522.18 533.904 522.9C533.637 523.62 533.257 524.233 532.764 524.74C532.27 525.233 531.677 525.62 530.984 525.9C530.29 526.167 529.524 526.3 528.684 526.3ZM528.684 515.14C528.404 515.14 528.157 515.22 527.944 515.38C527.744 515.527 527.57 515.8 527.424 516.2C527.29 516.6 527.184 517.153 527.104 517.86C527.037 518.553 527.004 519.433 527.004 520.5C527.004 521.58 527.037 522.473 527.104 523.18C527.184 523.873 527.29 524.427 527.424 524.84C527.57 525.253 527.75 525.54 527.964 525.7C528.177 525.86 528.424 525.94 528.704 525.94C528.984 525.94 529.224 525.86 529.424 525.7C529.637 525.527 529.81 525.24 529.944 524.84C530.077 524.427 530.177 523.867 530.244 523.16C530.324 522.453 530.364 521.56 530.364 520.48C530.364 519.413 530.33 518.533 530.264 517.84C530.197 517.147 530.09 516.6 529.944 516.2C529.81 515.8 529.637 515.527 529.424 515.38C529.21 515.22 528.964 515.14 528.684 515.14ZM534.86 515.48L539.28 514.84L539.64 514.88V518H539.74C540.02 516.813 540.386 515.973 540.84 515.48C541.306 514.973 541.846 514.72 542.46 514.72C542.553 514.72 542.653 514.727 542.76 514.74C542.866 514.753 542.946 514.773 543 514.8V518.1C542.906 518.073 542.773 518.053 542.6 518.04C542.44 518.027 542.273 518.02 542.1 518.02C541.606 518.02 541.166 518.047 540.78 518.1C540.393 518.153 540.04 518.247 539.72 518.38V525.36L541.2 525.66V526H534.92V525.66L536.06 525.36V516.3L534.86 515.82V515.48ZM546.394 510.36C546.914 510.36 547.367 510.54 547.754 510.9C548.14 511.26 548.334 511.707 548.334 512.24C548.334 512.773 548.14 513.22 547.754 513.58C547.367 513.927 546.914 514.1 546.394 514.1C545.86 514.1 545.407 513.927 545.034 513.58C544.66 513.22 544.474 512.773 544.474 512.24C544.474 511.707 544.66 511.26 545.034 510.9C545.407 510.54 545.86 510.36 546.394 510.36ZM543.434 515.48L547.814 514.84L548.314 514.88V525.34L549.434 525.66V526H543.514V525.66L544.654 525.34V516.3L543.434 515.82V515.48ZM553.497 520.02L555.897 519.56V518.1C555.897 516.993 555.763 516.227 555.497 515.8C555.243 515.373 554.81 515.16 554.197 515.16C554.13 515.16 554.063 515.167 553.997 515.18C553.93 515.18 553.863 515.187 553.797 515.2L551.097 518.86H550.757L550.837 515.46C551.357 515.3 551.95 515.147 552.617 515C553.283 514.853 554.043 514.78 554.897 514.78C556.363 514.78 557.51 515.02 558.337 515.5C559.163 515.98 559.577 516.84 559.577 518.08V525.2L560.637 525.48V525.76C560.423 525.893 560.117 526.007 559.717 526.1C559.33 526.207 558.91 526.26 558.457 526.26C557.737 526.26 557.183 526.147 556.797 525.92C556.41 525.693 556.137 525.38 555.977 524.98H555.877C555.57 525.393 555.183 525.72 554.717 525.96C554.25 526.187 553.677 526.3 552.997 526.3C552.117 526.3 551.403 526.04 550.857 525.52C550.31 524.987 550.037 524.247 550.037 523.3C550.037 522.38 550.323 521.66 550.897 521.14C551.47 520.607 552.337 520.233 553.497 520.02ZM554.977 524.86C555.203 524.86 555.39 524.827 555.537 524.76C555.683 524.693 555.803 524.6 555.897 524.48V520.08L555.157 520.14C554.583 520.193 554.177 520.42 553.937 520.82C553.697 521.207 553.577 521.807 553.577 522.62C553.577 523.5 553.703 524.093 553.957 524.4C554.223 524.707 554.563 524.86 554.977 524.86Z';
  const mapPaths = [
    'M578.7 516.6L577.5 515.6L577.7 513.5L576.7 511.6L576.8 505.9L573.9 503.9L572.2 504.4L570 503.7L569.1 505.2L565.3 504.6L563.2 505.6L559.8 505L557.1 503.7L555.3 502.3L553.7 502.7L551.4 502.8L546.5 502.2L545.6 501.1L544 501.5L541.7 499.8L540.1 497.8L537.5 498.5L535.7 497.5L533.6 497.2L532.9 497.4L532.1 499.4L529 502.9L524.5 500.1L521.5 496.8L521.2 494.8L517.7 491.2L516.9 490L514.3 488.4L512.9 486.8L511.1 486.9L509.3 484L509.4 482.7L507.2 482.4L506.1 476.6L506.7 474.1L504.3 472.6L503.3 472.7L499.8 470.7L499.6 472.3L494.5 473.3L493 468.7L491.9 467.5L491.7 464.2L490.2 463.5L490.1 461L488.9 460.3L483.8 459.4L480.3 461.5L477.3 459L473.3 457.4L471.6 481.9L471.1 488.8L468.9 521.5L468 532.9L466.5 532.7L470.4 535.2L472.2 537.3L472.8 539.2L475 540.3L475.8 538.5L478.1 537.3L480.2 537.8L484 540.4L487.5 539.9L490.3 541.5L494.5 545.4L496.9 546L499.7 548.8L501.8 548.9L503.9 551L506.8 549L509.3 548.1L512.6 544.5L516 543.2L519 541.4L521.7 541.9L523.5 539.8L522.3 538.4L519.9 539.3L518.2 538L521.9 536.4L522.8 536.5L525.4 534.4L527.8 534.2L528.6 536.9L529.4 537.4L529.7 539.7L527.1 543.1L524.9 543.7L526 546.3L527.5 546.1L531.5 541.9L532.9 541.6L535 542.2L535.8 544.6L533.8 545.8L533.5 547.8L535.4 550.3L537.9 550.4L539.7 553.1L540.2 555.6L542.6 554.1L544.3 555.3L545.3 557.9L547.3 560.6L547.8 557.8L548.8 556.6L547.8 555.3L545.8 556.2L545.6 554.3L544.5 553L545.9 552.1L548.6 552.5L553.8 552.2L556.1 551.5L558.5 549.4L565.2 544.2L570.6 540.9L576.8 539.3L579.7 539.2L584.9 539.8L587 539.7L597 540.8L599.9 539.6L601.2 537.8L603 537.3L577.9 520.4L578.7 516.6Z',
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
