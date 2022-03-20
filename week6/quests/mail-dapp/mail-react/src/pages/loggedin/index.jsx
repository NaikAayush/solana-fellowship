import React, { Fragment } from "react";
import { Route, Switch } from 'react-router-dom';
import { Box, useTheme } from "@mui/material";

import { Navbar } from "../../components";
import { Inbox } from "./Inbox";
import { Sent } from "./Sent";
import { SendMail } from './SendMail';
import { ViewMail } from "./ViewMail";

export function Main(props) {
  const theme = useTheme();

  return (
    <Fragment>
      <Navbar history={props.history} />

      <Box 
        sx={{
          width: { sm: 'calc(100% - 240px)'},
          mt: { sm: theme.spacing(8), xs: theme.spacing(7) },
          ml: { sm: theme.spacing(30) },
        }}
      >
        <Switch>
          <Route
            path='/mail/inbox'
            component={Inbox}
          />
          <Route
            path='/mail/sent'
            component={Sent}
          />
          <Route
            path='/mail/send'
            component={SendMail}
          />
          <Route
            path='/mail/view/:id'
            component={ViewMail}
          />
        </Switch>
      </Box>
    </Fragment>
  );
}
