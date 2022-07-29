import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import heatmapBuilder from '../helpers/heatmapBuilder';

HeatMap.propTypes = {
  plotData: PropTypes.object,
  plotWidth: PropTypes.number,
  parentSelector: PropTypes.string,
};

export default function HeatMap({ plotData, plotWidth, parentSelector }) {
  // Build HeatMap using D3 after this component mounts
  useEffect(() => {
    heatmapBuilder(plotData, plotWidth, parentSelector);
  }, [plotData, plotWidth]);

  return (
    <>
      <h1 id="title" className="display-6">
        Monthly Global Land Temperature 1753-2015
      </h1>
      <h3 id="description" className="display-6">
        Variance from Average Temperature (8.66℃)
      </h3>
      <div id="graph-container" />
    </>
  );
}
