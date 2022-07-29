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
  const height = 0.6 * width;
  const padding = { left: 80, bottom: 200, top: 40, right: 40 };

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
    .range([padding.left, width - padding.right]);

  const yscale = d3
    .scaleLinear()
    .domain([yMin - 1, yMax])
    .range([height - padding.bottom, padding.top]);

  const zscale = d3
    .scaleSequential()
    .domain([zMax, zMin])
    .interpolator(d3.interpolateRdYlBu);

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
    .attr('fill', (d) => zscale(getDataTemp(d)))
    .on('mouseover', function (e, d) {
      handleMouseOver.call(this, e, d, baseTemp);
    })
    .on('mouseout', handleMouseOut);

  // Add tooltip element
  const tooltip = plotDiv
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip');

  // Add axes to the chart
  const xAxis = d3
    .axisBottom(xscale)
    .tickFormat((year) => year.toString())
    .ticks(20);

  graphSVG
    .append('g')
    .style('font-size', '14px')
    .attr('transform', `translate(0, ${yscale(0)})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  const yAxis = d3
    .axisLeft(yscale)
    .tickValues([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5])
    .tickFormat((monthNum) => monthNumToMonthStr[parseInt(monthNum + 0.5)]);

  graphSVG
    .append('g')
    .style('font-size', '14px')
    .attr('transform', `translate(${padding.left}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // Create color legend for z-axis
  const zLegendScale = d3
    .scaleLinear()
    .domain([1, 10])
    .range([padding.left, padding.left + 400]);

  const zLegendAxis = d3.axisBottom(zLegendScale);

  console.log(
    'Made it here!',
    Array(100)
      .fill()
      .map((el, index) => zMin + (index / 100) * (zMax - zMin)),
  );

  // const zLegend = graphSVG.append('')

  graphSVG
    .selectAll('rect')
    .data(
      Array(100)
        .fill()
        .map((el, index) => zMin + (index / 100) * (zMax - zMin)),
    )
    .enter()
    .append('rect')
    .attr('x', (d) => zLegendScale(d))
    .attr('y', height - 40)
    .attr('width', (zLegendScale(zMax) - zLegendScale(zMin)) / 100)
    .attr('height', 40)
    .attr('fill', (d) => zscale(d));

  graphSVG
    .append('g')
    .style('font-size', '14px')
    .attr('transform', `translate(0, ${height - 40})`)
    .call(zLegendAxis);

  console.log('BUILT WHOLE GRAPH!!');
}
