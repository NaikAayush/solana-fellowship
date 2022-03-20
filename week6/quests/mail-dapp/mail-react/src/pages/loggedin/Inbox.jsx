import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fab } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import { MailTable } from "../../components";
import { getAccountData, setActivePage } from "../../store/actions";

export function Inbox(props) {
  const dispatch = useDispatch();
  const inbox = useSelector(state => state.mail.inbox);

  useEffect(() => {
    document.title = 'Inbox';
    dispatch(setActivePage('Inbox'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAccountData());
  }, [dispatch]);

  return (
    <Fragment>
      <MailTable data={inbox} history={props.history} />

      <Fab
        variant='extended'
        size='large'
        color='secondary'
        aria-label='compose mail'
        onClick={() => props.history.push('send', {from: 'inbox'})}
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
