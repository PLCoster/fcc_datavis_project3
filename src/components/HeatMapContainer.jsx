import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import dataBackup from '../assets/data.json';

import HeatMap from './HeatMap';

export default function HeatMapContainer() {
  const [plotData, setPlotData] = useState(null);
  const [plotWidth, setPlotWidth] = useState(0);

  const [graphOpacity, setGraphOpacity] = useState(0);

  const containerRef = useRef(null);

  // Load the dataset when the component mounts
  useEffect(() => {
    axios
      .get(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',
      )
      .then((response) => {
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
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="container-fluid">
      <main
        className="container-md"
        ref={containerRef}
        style={{ opacity: graphOpacity }}
      >
        {plotData ? (
          <HeatMap
            plotData={plotData}
            plotWidth={plotWidth}
            parentSelector="#graph-container"
            setGraphOpacity={setGraphOpacity}
          />
        ) : (
          <h3>Loading plot data...</h3>
        )}
      </main>
    </div>
  );
}
