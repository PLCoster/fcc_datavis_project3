import React, { useState, useEffect } from 'react';

import heatmapBuilder from '../helpers/heatmapBuilder';

export default function HeatMap({ plotData, plotWidth }) {
  console.log('This is the plot data: ', plotData);

  // Build HeatMap using D3
  heatmapBuilder(plotData, plotWidth);

  return (
    <>
      <h1 id="title">Monthly Global Land Temperature 1753-2015</h1>
      <h2 id="description">Variance from Average Temperature (8.66℃)</h2>
      {`${plotData.monthlyVariance}`}
    </>
  );
}
