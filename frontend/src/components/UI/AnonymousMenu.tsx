import {Button, Grid} from '@mui/material';
import {Link as navLink} from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <Grid item>
      <Button component={navLink} to="register" color="inherit">Sign Up</Button>
      <Button component={navLink} to="login" color="inherit">Sign In</Button>
    </Grid>
  );
};

export default AnonymousMenu;