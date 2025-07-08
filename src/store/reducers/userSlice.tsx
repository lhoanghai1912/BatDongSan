// app/redux/reducers/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userData: any;
  token: string | null;
}

const initialState: UserState = {
  userData: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserData(state: UserState, action: PayloadAction<any>) {
      state.userData = action.payload.userData;
    },
    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
    },
    updatePassword(state, action: PayloadAction<string>) {
      if (state.userData) {
        state.userData.password = action.payload;
      }
    },
    logout(state) {
      state.userData = null;
      state.token = null;
    },
  },
});

export const { setUserData, setToken, logout, updatePassword } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
