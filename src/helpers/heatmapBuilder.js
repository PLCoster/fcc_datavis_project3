import * as d3 from 'd3';

// Months need to be 0-indexed to pass FCC test suite
const monthNumToMonthStr = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

function setUpDataGetters(baseTemp) {
  const getDataYear = (tempObj) => tempObj.year;
  const getDataMonth = (tempObj) => tempObj.month - 1;
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
    .attr('data-month', cellData.month - 1)
    .attr('data-temp', cellData.variance + baseTemp)
    .attr('data-variance', cellData.variance)
    .style('visibility', 'visible')
    .style('top', `${e.clientY - 100}px`)
    .style(
      'left',
      `${cellData.year < 1884 ? e.clientX + 20 : e.clientX - 250}px`,
    )
    .style(
      'background-color',
      `${e.target.getAttribute('fill').slice(0, -1)}, 0.8)`,
    );

  tooltip
    .append('h5')
    .text(`${monthNumToMonthStr[cellData.month - 1]} ${cellData.year}`);

  tooltip
    .append('h6')
    .text(
      `Monthly Temperature: ${
        Math.round((cellData.variance + baseTemp) * 100) / 100
      }°C`,
    );

  tooltip
    .append('h6')
    .text(
      `Variation from Average: ${Math.round(cellData.variance * 100) / 100}°C`,
    );
}

// Hide the tooltip as mouse leaves cell
function handleMouseOut() {
  const tooltip = d3.select('#tooltip');
  tooltip.style('visibility', 'hidden');
}

// Main function to build the HeatMap SVG using D3
export default function heatmapBuilder(
  { baseTemperature: baseTemp, monthlyVariance: monthlyData },
  plotContainerWidth,
  parentSelector,
) {
  const [getDataYear, getDataMonth, getDataVariance, getDataTemp] =
    setUpDataGetters(baseTemp);

  const plotDiv = d3.select(parentSelector);

  plotDiv.html('');

  const width = Math.max(696, plotContainerWidth);
  const height = 0.6 * width;
  const padding = { left: 80, bottom: 140, top: 0, right: 40 };

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
    .domain([Math.ceil(zMax), Math.floor(zMin)])
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
  plotDiv
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .attr('id', 'tooltip');

  // Add axes to the chart
  const xAxis = d3
    .axisBottom(xscale)
    .tickFormat((year) => year.toString())
    .ticks(10);

  graphSVG
    .append('g')
    .style('font-size', '14px')
    .attr('transform', `translate(0, ${yscale(yMin - 1)})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  const yAxis = d3
    .axisLeft(yscale)
    .tickValues(
      Array(12)
        .fill()
        .map((el, i) => yMin - 0.5 + i),
    )
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
    .domain([Math.floor(zMin), Math.ceil(zMax)])
    .range([padding.left, padding.left + 400])
    .nice();

  const zLegendAxis = d3.axisBottom(zLegendScale);

  const zLegend = graphSVG.append('g').attr('id', 'legend');

  // Create 100 rect elements spanning full temperature range
  zLegend
    .selectAll('rect')
    .data(
      Array(100)
        .fill()
        .map(
          (el, index) =>
            Math.floor(zMin) +
            (index / 100) * (Math.ceil(zMax) - Math.floor(zMin)),
        ),
    )
    .enter()
    .append('rect')
    .attr('x', (d) => zLegendScale(d))
    .attr('y', height - 90)
    .attr('width', (zLegendScale(zMax) - zLegendScale(zMin)) / 100)
    .attr('height', 30)
    .attr('fill', (d) => zscale(d));

  zLegend
    .append('g')
    .style('font-size', '14px')
    .attr('transform', `translate(0, ${height - 60})`)
    .call(zLegendAxis);

  // Add axis labels
  graphSVG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .text('Month')
    .attr('x', -yscale(3.5))
    .attr('y', 30)
    .style('font-size', `${Math.max(Math.round(0.015 * width), 15)}px`)
    .style('font-weight', 600);

  graphSVG
    .append('text')
    .style('font-size', `${Math.max(Math.round(0.015 * width), 15)}px`)
    .text('Year')
    .attr('x', xscale((xMax + xMin) / 2))
    .attr('y', height + 40 - padding.bottom)
    .style('font-weight', 600);

  graphSVG
    .append('text')
    .style('font-size', `${Math.max(Math.round(0.015 * width), 15)}px`)
    .text('Temperature (°C)')
    .attr('x', zLegendScale(5.5))
    .attr('y', height - 20)
    .style('font-weight', 600);
}
