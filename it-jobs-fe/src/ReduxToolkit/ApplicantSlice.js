import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllApplicants = createAsyncThunk(
  'applicant/fetchAllApplicants',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get(`/api/applicants`);
      console.log('Fetch applicants - Success');
      return data;
    } catch (error) {
      console.log('Fetch applicants - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchApplicantById = createAsyncThunk(
  'applicant/fetchApplicantById',
  async ({ applicantId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get(`/api/applicants/${applicantId}`);
      console.log('Fetch applicant by id - Success');
      return data;
    } catch (error) {
      console.log('Fetch applicant by id - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const createApplicant = createAsyncThunk(
  'applicant/createApplicant',
  async ({ applicantData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.post(`/api/applicants`, applicantData);
      console.log('Created applicant - Success');
      return data;
    } catch (error) {
      console.log('Created applicant - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const updateApplicant = createAsyncThunk(
  'applicant/updateApplicant',
  async ({ id, updatedApplicantData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.put(
        `/api/applicants/${id}`,
        updatedApplicantData
      );
      console.log('Updated applicant - Success');
      return data;
    } catch (error) {
      console.log('Updated applicant - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const deleteApplicant = createAsyncThunk(
  'applicant/deleteApplicant',
  async ({ applicantId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      await api.delete(`/api/applicants/${applicantId}`);
      console.log('Applicant deleted - Success');
      return applicantId;
    } catch (error) {
      console.log('Applicant deleted - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchApplicantProfile = createAsyncThunk(
  'applicant/fetchApplicantProfile',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get(`/api/applicants/profile`);
      console.log('Fetched applicant profile - Success');
      return data;
    } catch (error) {
      console.log('Fetched applicant profile - Error', error.message);
      throw Error(
        error.response?.data?.error || 'Failed to fetch applicant profile'
      );
    }
  }
);

const applicantSlice = createSlice({
  name: 'applicant',
  initialState: {
    applicants: [],
    loading: false,
    error: null,
    applicantDetails: null,
    isFetched: false,
  },
  reducers: {
    clearApplicantState: (state) => {
      state.applicantDetails = null;
      state.applicants = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllApplicants
      .addCase(fetchAllApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
      })
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // fetchApplicantById
      .addCase(fetchApplicantById.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantDetails = action.payload;
      })

      // createApplicant
      .addCase(createApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplicant.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants.push(action.payload);
      })
      .addCase(createApplicant.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // updateApplicant
      .addCase(updateApplicant.fulfilled, (state, action) => {
        const updatedApplicant = action.payload;
        state.loading = false;
        state.applicants = state.applicants.map((applicant) =>
          applicant.id === updatedApplicant.id
            ? { ...applicant, ...updatedApplicant }
            : applicant
        );
      })

      // deleteApplicant
      .addCase(deleteApplicant.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = state.applicants.filter(
          (applicant) => applicant.id !== action.payload
        );
      })

      // fetchApplicantProfile
      .addCase(fetchApplicantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantDetails = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchApplicantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.isFetched = true;
      });
  },
});

export const { clearApplicantState } = applicantSlice.actions;
export default applicantSlice.reducer;