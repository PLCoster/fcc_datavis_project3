import * as d3 from 'd3';

export default function heatmapBuilder(plotData, plotContainerWidth) {
  console.log('DATA FOR BUILDER: ', plotData, plotContainerWidth);

  const plotDiv = d3.select('body');

  plotDiv.html('D3 is controlling this now!');

  const width = Math.max(696, plotContainerWidth);
  const height = 0.5 * width;
  const padding = 80;

  const graphSVG = plotDiv
    .append('svg')
    .attr('class', 'graph')
    .attr('width', width)
    .attr('height', height)
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'blue');
}
