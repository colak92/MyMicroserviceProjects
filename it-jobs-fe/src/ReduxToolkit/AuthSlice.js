import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, BASE_URL, setAuthHeader } from '../api/api';
import { clearApplicantState } from './ApplicantSlice';
import { clearCompanyProfile, clearCompanyState } from './CompanySlice';
import { clearJobState } from './JobSlice';
import { clearJobApplicationState } from './JobApplicationSlice';

import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (userData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/signin`, userData);
    localStorage.setItem('jwt', data.jwt);
    return data;
  } catch (error) {
    console.log('Login - Error', error.message);
    throw Error(error.response.data.error);
  }
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/signup`, userData);
    localStorage.setItem('jwt', data.jwt);
    return data;
  } catch (error) {
    console.log('Register - Error', error.message);
    throw Error(error.response.data.error);
  }
});

export const logout = createAsyncThunk('auth/logout', async (data) => {
  try {
    localStorage.clear();
    console.log('Logout - Success');
    return data;
  } catch (error) {
    console.log('Logout - Error', error.message);
    throw Error(error.response.data.error);
  }
});

export const logoutAndClearAllState = () => async (dispatch) => {
  await dispatch(logout());

  dispatch(clearApplicantState());
  dispatch(clearCompanyState());
  dispatch(clearCompanyProfile());
  dispatch(clearJobState());
  dispatch(clearJobApplicationState());
};

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (jwt) => {
    setAuthHeader(jwt, api);

    try {
      const { data } = await api.get(`/api/users/profile`);
      console.log('Profile - Success');
      return data;
    } catch (error) {
      console.log('Profile - Error', error.message);
      throw new Error(
        error?.response?.data?.error || 'Something went wrong during login'
      );
    }
  }
);

export const getUserList = createAsyncThunk('auth/getUserList', async (jwt) => {
  setAuthHeader(jwt, api);

  try {
    const { data } = await api.get(`/api/users`);
    return data;
  } catch (error) {
    console.log('Get all users - Error', error.message);
    throw Error(error.response.data.error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.loggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.loggedIn = true;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt = null;
        state.users = [];
        state.error = null;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;
