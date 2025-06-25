import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllFounders = createAsyncThunk(
  'company/fetchAllFounders',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/companies/founders`);
      console.log('Get founders - Success');
      return data.map((founder) => ({ id: founder.id, name: founder.name }));
    } catch (error) {
      throw Error(error.response?.data?.error || 'Error fetching founders');
    }
  }
);

const founderSlice = createSlice({
  name: 'founder',
  initialState: {
    founders: [],
    loading: false,
    error: null,
    founderDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFounders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFounders.fulfilled, (state, action) => {
        state.loading = false;
        state.founders = action.payload;
      })
      .addCase(fetchAllFounders.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default founderSlice.reducer;
