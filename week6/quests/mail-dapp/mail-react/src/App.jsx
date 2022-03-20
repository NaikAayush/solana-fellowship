import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";

import theme from './theme';
import { Signin } from './pages/loggedout/Signin';
import { PrivateRoute } from './components';
import { Main } from './pages/loggedin';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <PrivateRoute path='/mail' component={Main} />
            <Route path='/' component={Signin} />
          </Switch>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;
