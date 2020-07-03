// @flow

// ----- Imports ----- //
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { renderPage } from 'helpers/render';
import './ausMomentMap.scss';
import { Header } from 'pages/aus-moment-map/components/header';
import { Map } from 'pages/aus-moment-map/components/map';
import { Blurb } from 'pages/aus-moment-map/components/blurb';
import { CloseButton } from 'pages/aus-moment-map/components/closeButton';
import { TestimonialsCollection } from 'pages/aus-moment-map/types/testimonials';
import { TestimonialsContainer } from './components/testimonialsContainer';
import { useWindowWidth } from "./hooks/useWindowWidth";

// ----- Custom hooks ----- //

const useTestimonials = () => {
  const [testimonials, setTestimonials] = React.useState<TestimonialsCollection>(null);
  const testimonialsEndpoint = 'https://interactive.guim.co.uk/docsdata/18tKS4fsHcEo__gdAwp3UySA3-FVje72_adHBZBhWjXE.json';

  React.useEffect(() => {
    fetch(testimonialsEndpoint)
      .then(response => response.json())
      .then(data => data.sheets)
      .then(testimonialsData => setTestimonials(testimonialsData));
  }, []);

  return testimonials;
};

// ----- Render ----- //
const AusMomentMap = () => {
  const [selectedTerritory, setSelectedTerritory] = React.useState(null);
  const testimonials = useTestimonials();
  const { windowWidthIsGreaterThan, windowWidthIsLessThan } = useWindowWidth();

  const mapControls = useAnimation();
  const testimonialsControls = useAnimation();
  const blurbControls = useAnimation();

  const mapVariants = {
    initial: { width: '55%' },
    active: { width: '40%' },
  };

  const testimonialsVariants = {
    initial: { x: '58vw' },
    active: { x: '-58vw' },
  };

  const blurbVariants = {
    initial: { display: 'none' },
    active: { display: 'block' },
  };

  const runAnimation = (variant) => {
    if (windowWidthIsGreaterThan('desktop')) {
      testimonialsControls.start(variant);
      mapControls.start(variant);
      blurbControls.start(variant);
    }
  };

  const resetToInitial = () => {
    document.querySelectorAll('.selected').forEach(t => t.classList.remove('selected'));
    runAnimation('initial');
    setSelectedTerritory(null);
  };

  const handleClick = (e) => {
    const elementClassList = e.target.classList;
    const isPartOfMap = elementClassList.contains('map') || elementClassList.contains('label');
    const isWhitespace = elementClassList.contains('main');

    if (isPartOfMap) {
      const selectedTerritory = e.target.getAttribute('data-territory');
      setSelectedTerritory(selectedTerritory);
      runAnimation('active');
    } else if (isWhitespace) {
      resetToInitial();
    }
  };

  const handleCloseButtonClick = () => {
    resetToInitial();
  };

  return (
    <div className="map-page" onClick={handleClick}>
      <Header />
      <div className="main">
        <motion.div
          className="left"
          animate={mapControls}
          variants={mapVariants}
          transition={{ type: 'tween', duration: 0.2 }}
          positionTransition
        >
          <Map />
          <p className="map-caption">Tap the map to read messages from supporters</p>
          <motion.div className="left-padded-inner" animate={blurbControls} variants={blurbVariants}>
            <Blurb slim />
          </motion.div>
        </motion.div>
        <div className="right">
          <Blurb slim={false} />
          <motion.div
            className="testimonials-overlay"
            animate={testimonialsControls}
            variants={testimonialsVariants}
            transition={{ type: 'tween', duration: 0.2 }}
            positionTransition
          >
            <CloseButton onClick={handleCloseButtonClick} />
            <TestimonialsContainer testimonialsCollection={testimonials} selectedTerritory={selectedTerritory} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

renderPage(<AusMomentMap />, 'aus-moment-map');

export { AusMomentMap };
