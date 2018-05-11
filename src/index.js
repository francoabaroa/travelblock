import App from './components/App';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import registerServiceWorker from './workers/registerServiceWorker';

const AppUI = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<AppUI />, document.getElementById('root'));
// registerServiceWorker();
