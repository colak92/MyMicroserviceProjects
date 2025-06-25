import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllAdditionalSkills = createAsyncThunk(
  'job/fetchAllAdditionalSkills',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/jobs/additionalSkills`);
      return data.map((skill) => ({ id: skill.id, name: skill.name }));
    } catch (error) {
      throw Error(
        error.response?.data?.error || 'Error fetching additional skills'
      );
    }
  }
);

const additionalSkillSlice = createSlice({
  name: 'additionalSkill',
  initialState: {
    additionalSkills: [],
    loading: false,
    error: null,
    additionalSkillDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdditionalSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdditionalSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.additionalSkills = action.payload;
      })
      .addCase(fetchAllAdditionalSkills.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default additionalSkillSlice.reducer;
