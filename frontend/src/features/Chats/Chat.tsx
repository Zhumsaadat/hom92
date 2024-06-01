import {Avatar, Box, Button, CircularProgress, Grid, TextField, Typography} from '@mui/material';
import {selectAllUsers, selectAllUsersLoading} from '../Users/getUsersSlice.ts';
import {useAppDispatch, useAppSelector} from '../../App/hooks.ts';
import React, {useEffect, useRef, useState} from 'react';
import {getUsers} from '../Users/usersThunks.ts';
import { selectUser } from '../Users/usersSlice.ts';
import {ChatMessage, IncomingChatMessage} from '../../types';

const Chat = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAllUsersLoading);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080/chat');

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingChatMessage;

      setMessages(prevState => [...prevState, decodedMessage.payload]);

      console.log(decodedMessage.payload);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, []);

  useEffect(() => {
    const fetchUrl = async () => {
      await dispatch(getUsers());
    };

    void fetchUrl();
  }, [dispatch]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(JSON.stringify({type: 'SEND_MESSAGE', message: messageText}));

    setMessageText('');
  };

  return (
    <>
      <Grid container>
        <Grid item xs={4} sx={{border: "1px solid #000", p: 2, borderRadius: 1, ml: "20px"}}>
          <Typography component="div" variant="h6" sx={{mb: 4, borderBottom: "1px solid #000", pb: 1}}>
            Online user
          </Typography>
          {!isLoading ? users.map((elem) => (
            user && user._id !== elem._id ? (
              <Grid item key={elem._id} sx={{display: "flex", gap: 2, mb: 2, alignItems: "center"}}>
                <Avatar/>
                {elem.displayName}
              </Grid>
            ): ''
          )) : <CircularProgress />}
        </Grid>
        <Grid item xs={7} sx={{border: "1px solid #000", p: 2, borderRadius: 1, ml: "auto", mr: "20px"}}>
          <Typography component="div" variant="h6" sx={{mb: 4, borderBottom: "1px solid #000", pb: 1}}>
            Chat
          </Typography>
          {messages.map((message, idx) => (
            <Grid item key={idx}>
              <b>{message.author}: </b> {message.message}
            </Grid>
          ))}
          <Box component="form" onSubmit={sendMessage}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="messageText"
                  name="messageText"
                  value={messageText}
                  onChange={changeMessage}
                  fullWidth
                />
              </Grid>
              <Button type="submit">Send</Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;