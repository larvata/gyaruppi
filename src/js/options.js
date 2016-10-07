import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Options from './components/Options';

const App = () => (
  <MuiThemeProvider>
    <Options />
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('app-container')
);