import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import dataBackup from '../assets/data.json';

import HeatMap from './HeatMap';

export default function HeatMapContainer() {
  const [plotData, setPlotData] = useState(null);
  const [plotWidth, setPlotWidth] = useState(0);

  const containerRef = useRef(null);

  // Load the dataset when the component mounts
  useEffect(() => {
    axios
      .get(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',
      )
      .then((response) => {
        console.log(response);
        setPlotData(response.data);
      })
      .catch((err) => {
        // If an error occurs, load data from backup
        console.log('Error when trying to fetch data from API', err.message);
        setPlotData(dataBackup);
      });
  }, []);

  // Set up event listener to update plot width on window resize
  useEffect(() => {
    const handleWindowResize = () => {
      setPlotWidth(containerRef.current.clientWidth);
      console.log(
        'resized plot width to: ',
        containerRef.current.clientWidth,
        containerRef.current.offsetWidth,
        containerRef,
      );
    };
    console.log('LayoutEffect Triggered!');
    // handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  if (!plotData) {
    return (
      <main className="container-md">
        <h3>Loading plot data...</h3>
      </main>
    );
  }

  return (
    <main className="container-md" ref={containerRef}>
      <p>{plotWidth}</p>
      <HeatMap plotData={plotData} plotWidth={plotWidth} />
    </main>
  );
}
