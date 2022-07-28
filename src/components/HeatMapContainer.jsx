import React, { useState, useEffect } from 'react';
import axios from 'axios';

import dataBackup from '../assets/data.json';

import HeatMap from './HeatMap';

export default function HeatMapContainer() {
  const [plotData, setPlotData] = useState(null);

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

  if (!plotData) {
    return (
      <main className="container-md">
        <h3>Loading plot data...</h3>
      </main>
    );
  }

  return (
    <main className="container-md">
      <HeatMap plotData={plotData} />
    </main>
  );
}
