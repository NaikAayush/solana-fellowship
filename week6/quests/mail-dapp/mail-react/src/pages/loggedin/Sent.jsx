import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fab } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import { getAccountData, setActivePage } from "../../store/actions";
import { MailTable } from "../../components";

export function Sent(props) {
  const dispatch = useDispatch();
  const sent = useSelector(state => state.mail.sent);

  useEffect(() => {
    document.title = 'Sent';
    dispatch(setActivePage('Sent'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAccountData());
  }, [dispatch]);

  return (
    <Fragment>
      <MailTable data={sent} navigation={props.history} />

      <Fab
        variant='extended'
        size='large'
        color='secondary'
        aria-label='compose mail'
        onClick={() => props.history.push('send', {from: 'sent'})}
        sx={{
          position: 'absolute',
          bottom: 48,
          right: 16,
        }}
        >
        <EditIcon sx={{ mr: 1}} />
        Send Mail
      </Fab>
    </Fragment>
  );
}
