import {UserTypes} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {getUsers} from './usersThunks.ts';
import {RootState} from '../../App/store.ts';

interface UsersState {
  users: UserTypes[];
  isLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
};

export const usersSlice = createSlice({
  name: 'all/users',
  initialState,
  reducers: {
    removeUser(state, action) {
      state.users = state.users.filter(user => user._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, {payload: items}) => {
      state.isLoading = false;
      state.users = items;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.isLoading = false;
    });
  }});

export const { removeUser } = usersSlice.actions;
export const allUsersReducer = usersSlice.reducer;
export const selectAllUsers = (state: RootState) => state.allUsers.users;
export const selectAllUsersLoading = (state: RootState) => state.allUsers.isLoading;