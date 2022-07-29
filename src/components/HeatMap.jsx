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
        Variance from Average Monthly Temperature (8.66℃)
      </h3>
      <div id="graph-container" />
      <hr></hr>
      <p>
        The plot above shows the average global land temperature each month from
        1753 to 2015. Each monthly temperature is compared against the average
        monthly temperature across this period (8.66℃). This graph shows clearly
        a trend of increasing land temperature in recent years.
      </p>
    </>
  );
}
