// @flow
import React from 'react';
import { MapGroup } from 'pages/aus-moment-map/components/mapGroup';

type Props = {
  selectedTerritory: string,
  onClick: string => void,
}

export const NewSouthWales = (props: Props) => {
  const name = 'NSW';
  const labelContrast = true;
  const labelPath = 'M521.913 427V426.66L523.693 425.64V413.56L521.913 412.92V412.58H527.913L533.633 422.22H533.733V413.94L531.773 412.92V412.58H535.713V412.92L534.133 413.92V427H531.833L524.193 414.2H524.093V425.64L526.033 426.68V427H521.913ZM546.235 421.14H539.675C539.741 422.487 540.041 423.553 540.575 424.34C541.121 425.113 542.088 425.5 543.475 425.5C543.928 425.5 544.355 425.467 544.755 425.4C545.155 425.333 545.541 425.22 545.915 425.06V425.38C545.608 425.847 545.081 426.287 544.335 426.7C543.588 427.1 542.675 427.3 541.595 427.3C539.755 427.3 538.361 426.78 537.415 425.74C536.468 424.687 535.995 423.267 535.995 421.48C535.995 419.733 536.481 418.353 537.455 417.34C538.441 416.313 539.768 415.8 541.435 415.8C543.115 415.8 544.335 416.24 545.095 417.12C545.855 417.987 546.235 419.233 546.235 420.86V421.14ZM541.355 416.18C540.835 416.18 540.421 416.547 540.115 417.28C539.821 418.013 539.675 419.167 539.675 420.74L542.775 420.6C542.775 418.893 542.655 417.733 542.415 417.12C542.188 416.493 541.835 416.18 541.355 416.18ZM556.881 416.04L559.321 423.58H559.461L561.121 417.2L559.581 416.38V416.04H562.781V416.38L561.501 417.22L558.961 427H556.741L554.481 419.58H554.401L552.481 427H550.281L547.341 416.94L546.301 416.38V416.04H552.161V416.38L551.201 416.76L552.881 423.42H553.021L554.881 416.04H556.881ZM571.499 427.24C570.686 427.24 569.873 427.173 569.059 427.04C568.259 426.907 567.613 426.733 567.119 426.52L566.919 422.56H567.259L570.399 426.7C570.573 426.753 570.746 426.8 570.919 426.84C571.106 426.867 571.279 426.88 571.439 426.88C572.319 426.88 572.979 426.673 573.419 426.26C573.859 425.847 574.079 425.273 574.079 424.54C574.079 423.82 573.853 423.247 573.399 422.82C572.959 422.38 572.233 421.973 571.219 421.6L570.439 421.28C569.319 420.813 568.466 420.24 567.879 419.56C567.306 418.867 567.019 417.947 567.019 416.8C567.019 416.173 567.119 415.587 567.319 415.04C567.519 414.48 567.833 414 568.259 413.6C568.686 413.2 569.233 412.887 569.899 412.66C570.579 412.433 571.386 412.32 572.319 412.32C573.239 412.32 573.999 412.38 574.599 412.5C575.213 412.62 575.746 412.753 576.199 412.9L576.419 416.62H576.079L573.179 412.82C573.046 412.767 572.906 412.727 572.759 412.7C572.626 412.673 572.479 412.66 572.319 412.66C571.519 412.66 570.919 412.867 570.519 413.28C570.119 413.693 569.919 414.233 569.919 414.9C569.919 415.527 570.106 416.04 570.479 416.44C570.853 416.84 571.499 417.2 572.419 417.52L573.219 417.84C573.846 418.08 574.406 418.327 574.899 418.58C575.406 418.82 575.826 419.113 576.159 419.46C576.506 419.793 576.766 420.2 576.939 420.68C577.126 421.16 577.219 421.747 577.219 422.44C577.219 423.973 576.713 425.16 575.699 426C574.686 426.827 573.286 427.24 571.499 427.24ZM583.82 427.3C582.994 427.3 582.234 427.167 581.54 426.9C580.847 426.62 580.254 426.233 579.76 425.74C579.267 425.233 578.88 424.62 578.6 423.9C578.334 423.167 578.2 422.36 578.2 421.48C578.2 420.6 578.334 419.807 578.6 419.1C578.867 418.393 579.247 417.8 579.74 417.32C580.234 416.827 580.82 416.447 581.5 416.18C582.194 415.913 582.96 415.78 583.8 415.78C584.64 415.78 585.407 415.913 586.1 416.18C586.794 416.447 587.387 416.827 587.88 417.32C588.374 417.8 588.754 418.4 589.02 419.12C589.3 419.827 589.44 420.62 589.44 421.5C589.44 422.38 589.307 423.18 589.04 423.9C588.774 424.62 588.394 425.233 587.9 425.74C587.407 426.233 586.814 426.62 586.12 426.9C585.427 427.167 584.66 427.3 583.82 427.3ZM583.82 416.14C583.54 416.14 583.294 416.22 583.08 416.38C582.88 416.527 582.707 416.8 582.56 417.2C582.427 417.6 582.32 418.153 582.24 418.86C582.174 419.553 582.14 420.433 582.14 421.5C582.14 422.58 582.174 423.473 582.24 424.18C582.32 424.873 582.427 425.427 582.56 425.84C582.707 426.253 582.887 426.54 583.1 426.7C583.314 426.86 583.56 426.94 583.84 426.94C584.12 426.94 584.36 426.86 584.56 426.7C584.774 426.527 584.947 426.24 585.08 425.84C585.214 425.427 585.314 424.867 585.38 424.16C585.46 423.453 585.5 422.56 585.5 421.48C585.5 420.413 585.467 419.533 585.4 418.84C585.334 418.147 585.227 417.6 585.08 417.2C584.947 416.8 584.774 416.527 584.56 416.38C584.347 416.22 584.1 416.14 583.82 416.14ZM591.056 417.3L589.856 416.82V416.48L594.236 415.84L594.716 415.88V424.16C594.716 424.773 594.836 425.187 595.076 425.4C595.33 425.613 595.676 425.72 596.116 425.72C596.37 425.72 596.603 425.693 596.816 425.64C597.043 425.573 597.263 425.493 597.476 425.4V417.3L596.276 416.82V416.48L600.656 415.84L601.096 415.88V425.74L602.276 426.22V426.56L597.956 427.24L597.516 427.2V425.8H597.396C596.983 426.213 596.503 426.567 595.956 426.86C595.41 427.14 594.796 427.28 594.116 427.28C593.076 427.28 592.303 426.993 591.796 426.42C591.303 425.847 591.056 425.093 591.056 424.16V417.3ZM604.19 416.8H602.63V416.44L604.19 416.04V413.88L607.83 413.3V416.04H610.25V416.8H607.83V424.08C607.83 424.64 607.937 425.047 608.15 425.3C608.364 425.54 608.77 425.66 609.37 425.66C609.557 425.66 609.737 425.653 609.91 425.64C610.097 425.613 610.25 425.587 610.37 425.56V425.9C610.05 426.233 609.624 426.54 609.09 426.82C608.57 427.087 607.984 427.22 607.33 427.22C606.29 427.22 605.504 426.96 604.97 426.44C604.45 425.92 604.19 425.073 604.19 423.9V416.8ZM610.799 426.66L611.939 426.34V412.66L610.739 412.18V411.84L615.079 411.2L615.539 411.26V417.28H615.659C616.125 416.8 616.692 416.433 617.359 416.18C618.025 415.913 618.699 415.78 619.379 415.78C620.325 415.78 621.019 416.013 621.459 416.48C621.899 416.947 622.119 417.68 622.119 418.68V426.34L623.259 426.66V427H617.459V426.66L618.479 426.4V418.88C618.479 418.347 618.359 417.953 618.119 417.7C617.879 417.447 617.525 417.32 617.059 417.32C616.765 417.32 616.499 417.353 616.259 417.42C616.032 417.487 615.812 417.573 615.599 417.68V426.4L616.599 426.66V427H610.799V426.66ZM549.039 447L545.399 433.62L544.359 432.92V432.58H550.699V432.92L549.479 433.52L551.779 442.66H551.899L554.379 432.58H556.619L559.719 442.88H559.859L561.959 433.88L560.039 432.92V432.58H563.959V432.92L562.379 433.92L559.299 447H557.059L553.939 436.66H553.799L551.279 447H549.039ZM566.593 441.02L568.993 440.56V439.1C568.993 437.993 568.859 437.227 568.593 436.8C568.339 436.373 567.906 436.16 567.293 436.16C567.226 436.16 567.159 436.167 567.093 436.18C567.026 436.18 566.959 436.187 566.893 436.2L564.193 439.86H563.853L563.933 436.46C564.453 436.3 565.046 436.147 565.713 436C566.379 435.853 567.139 435.78 567.993 435.78C569.459 435.78 570.606 436.02 571.433 436.5C572.259 436.98 572.673 437.84 572.673 439.08V446.2L573.733 446.48V446.76C573.519 446.893 573.213 447.007 572.812 447.1C572.426 447.207 572.006 447.26 571.553 447.26C570.833 447.26 570.279 447.147 569.893 446.92C569.506 446.693 569.233 446.38 569.073 445.98H568.973C568.666 446.393 568.279 446.72 567.812 446.96C567.346 447.187 566.773 447.3 566.093 447.3C565.213 447.3 564.499 447.04 563.953 446.52C563.406 445.987 563.133 445.247 563.133 444.3C563.133 443.38 563.419 442.66 563.993 442.14C564.566 441.607 565.433 441.233 566.593 441.02ZM568.073 445.86C568.299 445.86 568.486 445.827 568.633 445.76C568.779 445.693 568.899 445.6 568.993 445.48V441.08L568.253 441.14C567.679 441.193 567.273 441.42 567.033 441.82C566.793 442.207 566.673 442.807 566.673 443.62C566.673 444.5 566.799 445.093 567.053 445.4C567.319 445.707 567.659 445.86 568.073 445.86ZM574.205 431.84L578.645 431.2L579.085 431.26V446.34L580.225 446.66V447H574.285V446.66L575.425 446.34V432.64L574.205 432.18V431.84ZM591.03 441.14H584.47C584.536 442.487 584.836 443.553 585.37 444.34C585.916 445.113 586.883 445.5 588.27 445.5C588.723 445.5 589.15 445.467 589.55 445.4C589.95 445.333 590.336 445.22 590.71 445.06V445.38C590.403 445.847 589.876 446.287 589.13 446.7C588.383 447.1 587.47 447.3 586.39 447.3C584.55 447.3 583.156 446.78 582.21 445.74C581.263 444.687 580.79 443.267 580.79 441.48C580.79 439.733 581.276 438.353 582.25 437.34C583.236 436.313 584.563 435.8 586.23 435.8C587.91 435.8 589.13 436.24 589.89 437.12C590.65 437.987 591.03 439.233 591.03 440.86V441.14ZM586.15 436.18C585.63 436.18 585.216 436.547 584.91 437.28C584.616 438.013 584.47 439.167 584.47 440.74L587.57 440.6C587.57 438.893 587.45 437.733 587.21 437.12C586.983 436.493 586.63 436.18 586.15 436.18ZM597.243 439.82C598.27 440.3 599.05 440.807 599.583 441.34C600.117 441.873 600.383 442.64 600.383 443.64C600.383 444.76 599.997 445.647 599.223 446.3C598.45 446.94 597.337 447.26 595.883 447.26C595.23 447.26 594.577 447.213 593.923 447.12C593.27 447.04 592.677 446.9 592.143 446.7L592.023 443.46H592.363L595.223 446.8C595.317 446.827 595.417 446.853 595.523 446.88C595.63 446.893 595.73 446.9 595.823 446.9C596.437 446.9 596.883 446.747 597.163 446.44C597.457 446.133 597.603 445.727 597.603 445.22C597.603 444.767 597.47 444.42 597.203 444.18C596.937 443.94 596.49 443.673 595.863 443.38L595.203 443.08C594.203 442.613 593.423 442.1 592.863 441.54C592.317 440.98 592.043 440.24 592.043 439.32C592.043 438.2 592.417 437.327 593.163 436.7C593.91 436.073 594.95 435.76 596.283 435.76C596.83 435.76 597.39 435.787 597.963 435.84C598.537 435.893 599.05 435.987 599.503 436.12L599.603 439.14H599.263L597.083 436.22C596.963 436.18 596.843 436.153 596.723 436.14C596.603 436.113 596.49 436.1 596.383 436.1C595.85 436.1 595.457 436.24 595.203 436.52C594.95 436.8 594.823 437.167 594.823 437.62C594.823 438.113 594.957 438.48 595.223 438.72C595.49 438.96 595.957 439.233 596.623 439.54L597.243 439.82Z';
  const mapPaths = [
    'M686.3 370.2L683.8 369.7L682.1 371.8L677.9 370L675.2 370.6L673.5 369.2L672.4 369.5L671.3 368.4L670.1 369.8L668.7 369.4L666.7 371L665.6 370.4L663.8 370.9L664.4 374.2L663.2 378.6L656.7 379L656.3 377.9L655.1 378.4L654.1 380.3L650.7 383.2L647.5 380L648 377.1L645.7 374.7L644.8 373.1L644.1 372.9L641.2 370.7L639.8 371.2L636.1 370.4L633.8 367.7L629 368.2L623.8 368L622.2 366.7H621.3L619.9 368.4L617.9 368.6L614.9 370.2L613.8 372.1L611.5 373.5L588.5 370.6L563.2 367.6L548.4 366L529 364.1L515.4 362.9L496.2 361.3L480.8 360.1L474.2 454.5L478.9 456.3L480.7 457.8L483.4 456.2L490 457.5L493.2 459.2L493.3 461.6L494.7 462.3L495 466.3L495.8 467.2L496.6 469.9L496.9 469.8L497.2 467.4L499.9 467.3L504.1 469.7L505.1 469.6L510.2 472.7L509.2 476.7L509.8 479.8L512.7 480.3L512.4 483.4L512.7 484L514.2 483.9L516.3 486.2L519.1 488L520.2 489.6L524.1 493.6L524.4 495.7L526.4 498L528.4 499.2L529.5 497.9L530.7 495.1L533.3 494.3L536.6 494.7L537.9 495.4L541.2 494.4L543.8 497.7L544.7 498.4L546.7 498L548 499.5L551.5 499.9L553.4 499.8L555.9 499.1L558.8 501.3L560.7 502.2L562.8 502.6L564.8 501.7L567.6 502.1L568.7 500.4L572.2 501.5L574.4 500.9L579.9 504.6L579.8 511.2L580.9 513.2L580.8 514.6L582.2 515.8L581.4 519.4L605.2 535.4L605.3 532.9L606.7 531.9L605.7 529.5V526.2L607.5 522.1L609.2 519.4L609.6 516.6L610.8 515.2L612.2 507.2L613.8 505.4L615.2 502.9L616.9 501L617.1 499.7L618.9 498L619 496.5L621.1 494.8L622.9 493.9L622.7 492.2L624.6 491.5L624.7 488.2L626.6 486L627.7 481.6L628.7 479.1L630 477.5L633.2 475.2L632.7 473.7L635.6 471.7L636.8 465.3L638.5 465L640.3 462.2L639.7 460.9L641.8 460.1L643.1 458.8L644.1 456.4L646 453.9L648 453L652.8 452.2L653.3 450.7L656.7 447.8L659.3 447.1L660.9 442.7L660 441.6L661 439.2L662.8 437.2L664.8 436.1L667.4 430.9L669 429.5L669.1 427.8L670.1 426.6L670.8 423.5L672.4 421.8L673.1 419.4L672.1 417.9L672.3 414.8L673.6 411.1L676 407.8L677.5 405L677.8 402.8L679.4 400.7L680.3 397.6L681.2 396.2L682.8 390.5L682.7 388.7L684.7 386.5L685.4 384L688.3 381L689.3 377.4L688.5 376.2L688.6 373.7L689.8 369.8V369.5L688.7 369.2L686.3 370.2ZM599.4 495.7L599.1 496L598.6 499L597.3 503.3L595.4 507L591.5 503.9L591.4 501.5L589.9 500.9L590 495.7L591.5 491.4L598.5 487.7L600.8 491L603.4 495.8L599.4 495.7Z',
  ];

  return (
    <MapGroup
      name={name}
      labelContrast={labelContrast}
      labelPath={labelPath}
      mapPaths={mapPaths}
      selectedTerritory={props.selectedTerritory}
      onClick={props.onClick}
    />
  );
};
