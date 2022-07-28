import * as d3 from 'd3';

const monthNumToMonthStr = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

function setUpGetters(baseTemp) {
  const getDataYear = (tempObj) => tempObj.year;
  const getDataMonth = (tempObj) => tempObj.month;
  const getDataVariance = (tempObj) => tempObj.variance;
  const getDataTemp = (tempObj) => tempObj.variance + baseTemp;
  return [getDataYear, getDataMonth, getDataVariance, getDataTemp];
}

// Reveals, updates and positions the tooltip on plot cell mouseover
function handleMouseOver(e, cellData, baseTemp) {
  const tooltip = d3.select('#tooltip');

  tooltip
    .html('')
    .attr('data-year', cellData.year)
    .attr('data-month', cellData.month)
    .attr('data-temp', cellData.variance + baseTemp)
    .attr('data-variance', cellData.variance)
    .style('visibility', 'visible')
    .style('top', `${e.layerY - 20}px`)
    .style(
      'left',
      `${cellData.year < 1884 ? e.layerX + 40 : e.layerX - 300}px`,
    );

  tooltip
    .append('h4')
    .text(`${monthNumToMonthStr[cellData.month]} ${cellData.year}`);

  tooltip
    .append('h5')
    .text(
      `Average Temperature: ${
        Math.round((cellData.variance + baseTemp) * 100) / 100
      }°C`,
    );

  tooltip
    .append('h5')
    .text(
      `Difference from Base Temp: ${Math.round(cellData.variance * 100) / 100}`,
    );
}

// Hide the tooltip as mouse leaves cell
function handleMouseOut() {
  console.log('MOUSE OUT');
  const tooltip = d3.select('#tooltip');
  tooltip.style('visibility', 'hidden');
}

export default function heatmapBuilder(
  { baseTemperature: baseTemp, monthlyVariance: monthlyData },
  plotContainerWidth,
) {
  const [getDataYear, getDataMonth, getDataVariance, getDataTemp] =
    setUpGetters(baseTemp);

  const plotDiv = d3.select('body');

  plotDiv.html('D3 is controlling this now!');

  const width = Math.max(1200, plotContainerWidth);
  const height = 0.5 * width;
  const padding = 80;

  const graphSVG = plotDiv
    .append('svg')
    .attr('class', 'graph')
    .attr('width', width)
    .attr('height', height);

  const [xMin, xMax] = d3.extent(monthlyData, getDataYear);
  const [yMin, yMax] = d3.extent(monthlyData, getDataMonth);
  const [zMin, zMax] = d3.extent(monthlyData, getDataTemp);

  // Create Scales for x,y an z (color) axes of graph
  const xscale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([padding, width - padding]);

  const yscale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - padding, padding]);

  // Add data cells to the HeatMap
  graphSVG
    .selectAll('rect')
    .data(monthlyData)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', getDataMonth)
    .attr('data-year', getDataYear)
    .attr('data-temp', getDataTemp)
    .attr('data-variance', getDataVariance)
    .attr('x', (d) => xscale(getDataYear(d)))
    .attr('y', (d) => yscale(getDataMonth(d)))
    .attr('width', xscale(xMin + 1) - xscale(xMin))
    .attr('height', yscale(yMin) - yscale(yMin + 1))
    .style('fill', 'blue')
    .on('mouseover', function (e, d) {
      handleMouseOver.call(this, e, d, baseTemp);
    })
    .on('mouseout', handleMouseOut);

  const tooltip = plotDiv
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip');
}
