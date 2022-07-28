import React, { useState, useEffect } from 'react';

export default function HeatMap({ plotData }) {
  console.log('This is the plot data: ', plotData);
  return (
    <>
      <h3>This is the HeatMap</h3>
      {`${plotData.monthlyVariance}`}
    </>
  );
}
