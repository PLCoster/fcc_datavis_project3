# Free Code Camp: Data Visualisation Project 3 - Heat Map

## Interactive Global Monthly Temperature Heat Map

The aim of this project was to build a small web app and data visualisation with functionality similar to: https://codepen.io/freeCodeCamp/full/JEXgeY

The project was built using the following technologies:

- **HTML**
- **JavaScript** with **[Node.js](https://nodejs.org/en/) / [NPM](https://www.npmjs.com/)** for package management
- **[React](https://reactjs.org/)** for application view with React Hooks to handle the application state
- **[D3](https://d3js.org/)** to generate the SVG Heat Map from the API data
- **[Bootstrap](https://getbootstrap.com/)** for styling with some custom **SASS / SCSS**
- **[FontAwesome](https://fontawesome.com/)** for icons
- **[webpack](https://webpack.js.org/)** to bundle React / JS / Styles and utilise development server

### Project Requirements:

- **User Story #1:** My heat map should have a title with a corresponding `id="title"`.

- **User Story #2:** My heat map should have a description with a corresponding `id="description"`.

- **User Story #3:** My heat map should have an x-axis with a corresponding `id="x-axis"`.

- **User Story #4:** My heat map should have a y-axis with a corresponding `id="y-axis"`.

- **User Story #5:** My heat map should have `rect` elements with a `class="cell"` that represent the data.

- **User Story #6:** There should be at least 4 different fill colors used for the cells.

- **User Story #7:** Each cell will have the properties `data-month`, `data-year`, `data-temp` containing their corresponding `month`, `year`, and `temperature` values.

- **User Story #8:** The `data-month`, `data-year` of each cell should be within the range of the data.

- **User Story #9:** My heat map should have cells that align with the corresponding month on the y-axis.

- **User Story #10:** My heat map should have cells that align with the corresponding year on the x-axis.

- **User Story #11:** My heat map should have multiple tick labels on the y-axis with the full month name.

- **User Story #12:** My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.

- **User Story #13:** My heat map should have a legend with a corresponding `id="legend"`.

- **User Story #14:** My legend should contain `rect` elements.

- **User Story #15:** The `rect` elements in the legend should use at least 4 different fill colors.

- **User Story #16:** I can mouse over an area and see a tooltip with a corresponding `id="tooltip"` which displays more information about the area.

- **User Story #17:** My tooltip should have a `data-year` property that corresponds to the `data-year` of the active area.

### Project Writeup:

For the third Free Code Camp: Data Visualisation Project, I decided to incorporate the Heat Map inside a small React app, bundled using webpack. After the chart data has been fetched (using the [axios](https://www.npmjs.com/package/axios) HTTP client), the Heat Map is built using the low-level D3 SVG API, through correctly positioned and coloured `<rect>` elements.

Going beyond the required User Stories outlined above, the plot generated by the app is responsive to changes in the browser window size. A `window.onresize` event listener is added using a `useEffect` hook inside the `HeatMapContainer` component. When the window size changes, the graph container width is passed as props to the `HeatMap` component, which causes the D3 SVG to be re-rendered according to the available size.

In addition, the displayed tool-tip when the cursor is placed on a data bar in the graph adjusts its positioning to ensure it is always contained inside the graph area, and not hidden off screen.

### Project Files:

- `index.html` - is a simple HTML template to mount the React appliaction onto. Webpack adds the scripts required to load the JS bundle when the project is built.

- `index.jsx` - the entry point to the application, it imports `bootstraps` script and the style sheet, and renders the React root component `App` onto the page.

- `styles.scss` - the style sheet for the app, that imports bootstrap styles and contains custom styles for the app.

- `helpers/heatmapBuilder.js` - contains a set of functions that build the Heat Map and append it to a desired DOM element. Scaling and positioning of `<rect>` elements in the Heat Map is aided using D3's `scaleLinear()` functionality. Similarly, the z-axis color scale is generated using D3's `scaleSequential()` and `interpolator()` functionalities.

- `/docs` - contains a copy of the built app files for deployment via github-pages

#### Components

- `App.jsx` is a simple container component for the `Navbar` and `HeatMapContainer` components:

  - `Navbar.jsx` is a presentational navbar component, providing links to other projects / sites.

  - `HeatMapContainer.jsx` - after mounting, this component uses two `useEffect` hooks. One of these hooks uses `axios` to fetch the data for the Heat Map, and upon receiving the data, passes it to the `HeatMap` component. The other hook sets up the `window.onresize` event listener, listening for window resize events and then passing the current width of the `#graph-container` element to the `HeatMap` component so it knows the size of plot to create. This component also has a state variable `graphOpacity`, the setter function for which is also passed to `HeatMap` so that it can make the `main` element visible after the graph has been fully rendered.

    - `HeatMap.jsx` - this component uses a `useEffect` hook to render the Heat Map SVG after the component mounts, and also whenever the `plotWidth` prop passed to it by `HeatMapContainer` changes. The HeatMap is built and mounted to the `#graph-container` element by the functions in `helpers/heatmapBuilder.js`. After building the graph, the opacity of the `main` element is set to 1 using the `setGraphOpacity` dispatch function, making the graph visible. An on:hover tooltip is also added to the graph - it is a small div element which has its position, visibility and contents adjusted dynamically based on the current mouse position, using the `mouseover` event on Heat Map cells.

### Usage

Requires Node.js / NPM in order to install required packages. After downloading the repo, install required dependencies with:

`npm install`

The webpack development server can then be started with:

`npm run dev`

The development server can then be viewed at `http://localhost:8080/` in the browser.

A production build can be created in the `dist/` folder by running:

`npm run build`

To view the production build, open the output html file in the dist folder in your browser, or serve it using Live Server in VSCode.
