import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllCompanies = createAsyncThunk(
  'company/fetchAllCompanies',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get('/api/companies');
      console.log('Fetch companies - Success');
      return data;
    } catch (error) {
      console.error('Fetch companies - Error', error.message);
      throw Error(error.response?.data?.error || error.message);
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
      console.error('Fetch company by id - Error', error.message);
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async ({ companyData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.post('/api/companies', companyData);
      console.log('Created company - Success');
      return data;
    } catch (error) {
      console.error('Created company - Error', error.message);
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, updatedCompanyData }) => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.put(`/api/companies/${id}`, updatedCompanyData);
      console.log('Updated company - Success');
      return data;
    } catch (error) {
      console.error('Updated company - Error', error.message);
      throw Error(error.response?.data?.error || error.message);
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
      console.error('Company deleted - Error', error.message);
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

export const fetchCompanyProfile = createAsyncThunk(
  'company/fetchCompanyProfile',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);

    try {
      const { data } = await api.get('/api/companies/profile');
      console.log('Fetched company profile - Success');
      return data;
    } catch (error) {
      console.error('Fetched company profile - Error', error.message);
      throw Error(error.response?.data?.error || 'Failed to fetch company profile');
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
    isFetched: false,
  },
  reducers: {
    clearCompanyProfile: (state) => {
      state.companyDetails = null;
      state.error = null;
      state.loading = false;
      state.isFetched = false;
    },
    clearCompanyState: (state) => {
      state.companyDetails = null;
      state.companies = [];
      state.error = null;
      state.loading = false;
      state.isFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllCompanies
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

      // fetchCompanyById
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createCompany
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
        state.companyDetails = action.payload;
        state.isFetched = true;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // updateCompany
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload;
        state.loading = false;
        state.companyDetails = updatedCompany; // Update profile data in state
        state.companies = state.companies.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        );
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteCompany
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchCompanyProfile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company profile';
        state.isFetched = true;
      });
  },
});

export const { clearCompanyState } = companySlice.actions;
export const { clearCompanyProfile } = companySlice.actions;

export default companySlice.reducer;
