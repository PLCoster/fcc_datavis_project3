import React, { useState, useEffect } from 'react';

import heatmapBuilder from '../helpers/heatmapBuilder';

export default function HeatMap({ plotData, plotWidth, parentSelector }) {
  const [plotElements, setPlotElements] = useState(null);

  // Build HeatMap using D3
  useEffect(() => {
    console.log('RUNNING EFFECT! ', plotWidth);
    heatmapBuilder(plotData, plotWidth, parentSelector);
  }, [plotData, plotWidth]);

  return (
    <>
      <h1 id="title">Monthly Global Land Temperature 1753-2015</h1>
      <h2 id="description">Variance from Average Temperature (8.66℃)</h2>
      <div id="graph-container" />
    </>
  );
}
