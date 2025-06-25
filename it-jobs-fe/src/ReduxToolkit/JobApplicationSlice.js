import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllJobApplications = createAsyncThunk(
  'job/fetchAllJobApplications',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/job-applications`);
      console.log('Fetch job-applications - Success');
      return data;
    } catch (error) {
      console.error('Fetch job-applications - Error', error.message);
      throw Error(error?.response?.data || 'Failed to fetch job applications');
    }
  }
);

export const fetchJobApplicationById = createAsyncThunk(
  'job/fetchJobApplicationById',
  async (jobApplicationId) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(
        `/api/job-applications/${jobApplicationId}`
      );
      console.log('Fetch job-application by id - Success');
      return data;
    } catch (error) {
      console.error('Fetch job-application by id - Error', error.message);
      throw Error(error?.response?.data || 'Failed to fetch job application');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'job/applyToJob',
  async (jobApplicationData) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.post(
        `/api/job-applications`,
        jobApplicationData
      );
      console.log('Apply to job - Success');
      return data;
    } catch (error) {
      console.error('Apply to job - Error', error.message);
      throw Error(error?.response?.data || 'Failed to apply to job');
    }
  }
);

const jobApplicationSlice = createSlice({
  name: 'jobApplication',
  initialState: {
    loading: false,
    error: null,
    jobApplicationDetails: null,
    jobApplications: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchAllJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchJobApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplicationDetails = action.payload;
      })
      .addCase(fetchJobApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications.push(action.payload);
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default jobApplicationSlice.reducer;
