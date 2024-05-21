import React, {useState} from 'react';
import {UserTypes} from '../../types';
import {Button, Menu, MenuItem} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {getUsers, logout} from '../../features/Users/usersThunks.ts';
import {useAppDispatch} from '../../App/hooks.ts';
import {removeUser} from '../../features/Users/getUsersSlice.ts';

interface Props {
  user: UserTypes;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeUser(user._id));
    dispatch(getUsers());
    navigate('/login');
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        Hello, {user.displayName}!
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} keepMounted>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;