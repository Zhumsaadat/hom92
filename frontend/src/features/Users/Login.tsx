import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {LoginMutation} from '../../types';
import {Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {useAppDispatch, useAppSelector} from '../../App/hooks.ts';
import {selectLoginError, selectUser} from './usersSlice.ts';
import {googleLogin, loginUser} from './usersThunks.ts';
import {GoogleLogin} from '@react-oauth/google';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectLoginError);
  const user = useAppSelector(selectUser);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onclose = () => console.log('ws closed');


  }, []);

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState(prevState => {
      return {...prevState, [name]: value};
    });
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(loginUser(state)).unwrap();
    navigate('/');
  };

  useEffect(() => {
    if (user && ws.current) {
      ws.current.send(JSON.stringify({type: 'LOGIN', payload: user.token}));
    }
  }, [user]);

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{mt: 3, width: '100%'}}>
              {error.error}
            </Alert>
          )}
          <Box sx={{pt: 2}}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void googleLoginHandler(credentialResponse.credential);
                }

                navigate('/');
              }}
              onError={() => {
                console.log('Login failed');
              }} />
          </Box>
          <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="E-mail"
                  name="email"
                  value={state.email}
                  onChange={inputChangeHandler}
                  autoComplete="current-email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="password"
                  label="Password"
                  type="password"
                  value={state.password}
                  onChange={inputChangeHandler}
                  autoComplete="new-password"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Sign in
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Or sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;