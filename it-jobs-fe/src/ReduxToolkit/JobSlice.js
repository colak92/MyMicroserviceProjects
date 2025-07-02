import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllJobs = createAsyncThunk('job/fetchAllJobs', async () => {
  setAuthHeader(localStorage.getItem('jwt'), api);
  try {
    const { data } = await api.get(`/api/jobs`);
    console.log('Fetch jobs - Success');
    return data;
  } catch (error) {
    console.log('Fetch jobs - Error', error.message);
    throw Error(error.response.data.error);
  }
});

export const fetchJobsByCompany = createAsyncThunk(
  'job/fetchJobsByCompany',
  async (companyId) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/jobs/company/${companyId}`);
      console.log('Get jobs for company - Success');
      return { companyId, jobs: data };
    } catch (error) {
      console.log('Get jobs for company - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'job/fetchJobById',
  async ({ jobId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/jobs/${jobId}`);
      console.log('Fetch job by id - Success');
      return data;
    } catch (error) {
      console.log('Fetch job by id - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const createJob = createAsyncThunk(
  'job/createJob',
  async ({ jobData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.post(`/api/jobs`, jobData);
      console.log('Created job - Success');
      return data;
    } catch (error) {
      console.log('Created job - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, updatedJobData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.put(`/api/jobs/${id}`, updatedJobData);
      console.log('Updated job - Success');
      return data;
    } catch (error) {
      console.log('Updated job - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async ({ jobId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      await api.delete(`/api/jobs/${jobId}`);
      console.log('Job deleted - Success');
      return jobId;
    } catch (error) {
      console.log('Job deleted - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    jobDetails: null,
    companyJobsById: {},
  },
  reducers: {
    clearJobState: (state) => {
      state.jobDetails = null;
      state.jobs = [];
      state.companyJobsById = {};
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(fetchJobsByCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsByCompany.fulfilled, (state, action) => {
        const { companyId, jobs } = action.payload;
        state.loading = false;
        state.companyJobsById[companyId] = jobs;
      })
      .addCase(fetchJobsByCompany.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.jobDetails = action.payload;
      })

      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        state.loading = false;
        state.jobs = state.jobs.map((job) =>
          job.id === updatedJob.id ? { ...job, ...updatedJob } : job
        );
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  },
});

export const { clearJobState } = jobSlice.actions;
export default jobSlice.reducer;