import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllCompanies = createAsyncThunk(
  'company/fetchAllCompanies',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get(`/api/companies`);
      console.log('Fetch companies - Success');
      return data;
    } catch (error) {
      console.log('Fetch companies - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'company/fetchCompanyById',
  async ({ companyId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get(`/api/companies/${companyId}`);
      console.log('Fetch company by id - Success');
      return data;
    } catch (error) {
      console.log('Fetch company by id - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async ({ companyData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.post(`/api/companies`, companyData);
      console.log('Created company - Success');
      return data;
    } catch (error) {
      console.log('Created company - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, updatedCompanyData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.put(
        `/api/companies/${id}`,
        updatedCompanyData
      );
      console.log('Updated company - Success');
      return data;
    } catch (error) {
      console.log('Updated company - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async ({ companyId }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      await api.delete(`/api/companies/${companyId}`);
      console.log('Company deleted - Success');
      return companyId;
    } catch (error) {
      console.log('Company deleted - Error', error.message);
      throw Error(error.response.data.error);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    loading: false,
    error: null,
    companyDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
      })
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload;
        state.loading = false;
        state.companies = state.companies.map((company) =>
          company.id === updatedCompany.id
            ? { ...company, ...updatedCompany }
            : company
        );
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload
        );
      });
  },
});

export default companySlice.reducer;
