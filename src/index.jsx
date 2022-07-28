import React from 'react';
import { render } from 'react-dom';

import 'bootstrap';

import './styles.scss';

const App = () => {
  return <h1>This is your App</h1>;
};

render(<App />, document.getElementById('root'));
