import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setAuthHeader } from "../api/api";

export const fetchAllApplicants = createAsyncThunk(
  "applicant/fetchAllApplicants",
  async () => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      const { data } = await api.get(`/api/applicants`);
      console.log("Fetch applicants data: ", data);
      return data;
    } catch (error) {
      console.log("Fetch applicants - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchApplicantById = createAsyncThunk(
  "applicant/fetchApplicantById",
  async ({ applicantId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      const { data } = await api.get(`/api/applicants/${applicantId}`);
      console.log("Fetch applicant by id: ", data);
      return data;
    } catch (error) {
      console.log("Fetch applicant by id - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const createApplicant = createAsyncThunk(
  "applicant/createApplicant",
  async ({ applicantData }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      const { data } = await api.post(`/api/applicants`, applicantData);
      console.log("Created applicant: ", data);
      return data;
    } catch (error) {
      console.log("Created applicant - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const updateApplicant = createAsyncThunk(
  "applicant/updateApplicant",
  async ({ id, updatedApplicantData }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      const { data } = await api.put(
        `/api/applicants/${id}`,
        updatedApplicantData
      );
      console.log("Updated applicant: ", data);
      return data;
    } catch (error) {
      console.log("Updated applicant - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const deleteApplicant = createAsyncThunk(
  "applicant/deleteApplicant",
  async ({ applicantId }) => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      await api.delete(`/api/applicants/${applicantId}`);
      console.log("Applicant deleted successfully");
      return applicantId;
    } catch (error) {
      console.log("Applicant deleted - Catch error", error);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchApplicantProfile = createAsyncThunk(
  "applicant/fetchApplicantProfile",
  async () => {
    setAuthHeader(localStorage.getItem("jwt"), api);

    try {
      const { data } = await api.get(`/api/applicants/profile`);
      console.log("Fetched applicant profile:", data);
      return data;
    } catch (error) {
      console.log("fetchApplicantProfile - Catch error", error);
      throw Error(
        error.response?.data?.error || "Failed to fetch applicant profile"
      );
    }
  }
);

const applicantSlice = createSlice({
  name: "applicant",
  initialState: {
    applicants: [],
    loading: false,
    error: null,
    applicantDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchApplicantById.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantDetails = action.payload;
      })
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
      .addCase(updateApplicant.fulfilled, (state, action) => {
        const updatedApplicant = action.payload;
        state.loading = false;
        state.applicants = state.applicants.map((applicant) =>
          applicant.id === updatedApplicant.id
            ? { ...applicant, ...updatedApplicant }
            : applicant
        );
      })
      .addCase(deleteApplicant.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = state.applicants.filter(
          (applicant) => applicant.id !== action.payload
        );
      })
      .addCase(fetchApplicantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantDetails = action.payload;
      })
      .addCase(fetchApplicantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default applicantSlice.reducer;
