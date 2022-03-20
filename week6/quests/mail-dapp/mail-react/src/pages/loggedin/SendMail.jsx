import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, TextField, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { v4 as uuidv4 } from 'uuid';

import { sendMail } from '../../store/actions';
import { Mail } from '../../models';

export function SendMail(props) {
  const [toAddress, setToAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const dispatch = useDispatch();
  const loading = useSelector(state => state.mail.loading);
  const accountId = useSelector(state => state.account.accountId);

  const theme = useTheme();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mail = new Mail({
      id: uuidv4(),
      fromAddress: accountId.toBase58(),
      toAddress: toAddress,
      subject,
      body,
      sentDate: new Date().toLocaleString()
    });

    await dispatch(sendMail(mail))

    props.history.push(`/mail/${props.location.state.from}`);
  };

  useEffect(() => {
    document.title = 'Send Mail'
  }, []);

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: { sm: 'calc(100vh - 64px)', xs: 'calc(100vh - 56px)'},
        '& .MuiTextField-root': { m: theme.spacing(1), width: '90%' }
      }}
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: theme.spacing(1),
          width: '80%',
          height: '80%'
        }}
        elevation={3}
      >
        <TextField
          id='to-address'
          label='To'
          value={toAddress}
          onChange={event => setToAddress(event.target.value)}
          required
        />
        <TextField
          id='subject'
          label='Subject'
          value={subject}
          onChange={event => setSubject(event.target.value)}
        />
        <TextField
          id='body'
          label='Body'
          multiline
          rows={15}
          value={body}
          onChange={event => setBody(event.target.value)}
          required
        />

        <Box
          sx={{
            display: 'flex',
            width: '90%',
            justifyContent: 'flex-end'
          }}
        >
          <LoadingButton
            color='secondary'
            variant='outlined'
            type='submit'
            startIcon={<SendIcon />}
            loading={loading}
            loadingPosition='start'
          >
            Send
          </LoadingButton>
        </Box>
        </Paper>
    </Box>
  );
}
