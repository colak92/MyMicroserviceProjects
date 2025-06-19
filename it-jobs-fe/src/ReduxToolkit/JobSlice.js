import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setAuthHeader } from "../api/api";

export const fetchAllJobs = createAsyncThunk("job/fetchAllJobs", async () => {
  setAuthHeader(localStorage.getItem("jwt"), api);
  try {
    const { data } = await api.get(`/api/jobs`);
    console.log("Fetch jobs data: ", data);
    return data;
  } catch (error) {
    console.log("Fetch jobs - Catch error", error);
    throw Error(error.response.data.error);
  }
});

export const fetchJobsByCompany = createAsyncThunk(
  "job/fetchJobsByCompany",
  async (companyId) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const { data } = await api.get(`/api/jobs/company/${companyId}`);
      return data;
    } catch (error) {
      console.log("Get Jobs For Company - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "job/fetchJobById",
  async ({ jobId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const { data } = await api.get(`/api/jobs/${jobId}`);
      console.log("Fetch job by id: ", data);
      return data;
    } catch (error) {
      console.log("Fetch job by id - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const createJob = createAsyncThunk(
  "job/createJob",
  async ({ jobData }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const { data } = await api.post(`/api/jobs`, jobData);
      console.log("Created job: ", data);
      return data;
    } catch (error) {
      console.log("Created job - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ id, updatedJobData }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      const { data } = await api.put(`/api/jobs/${id}`, updatedJobData);
      console.log("Updated job: ", data);
      return data;
    } catch (error) {
      console.log("Updated job - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async ({ jobId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);
    try {
      await api.delete(`/api/jobs/${jobId}`);
      console.log("Job deleted successfully");
      return jobId;
    } catch (error) {
      console.log("Job deleted - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    jobDetails: null,
    companyJobs: [],
  },
  reducers: {},
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
        state.loading = false;
        state.companyJobs = action.payload;
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

export default jobSlice.reducer;
