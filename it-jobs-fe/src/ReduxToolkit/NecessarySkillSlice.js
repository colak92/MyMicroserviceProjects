import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, setAuthHeader } from '../api/api';

export const fetchAllNecessarySkills = createAsyncThunk(
  'job/fetchAllNecessarySkills',
  async () => {
    setAuthHeader(localStorage.getItem('jwt'), api);
    try {
      const { data } = await api.get(`/api/jobs/necessarySkills`);
      return data.map((skill) => ({ id: skill.id, name: skill.name }));
    } catch (error) {
      throw Error(
        error.response?.data?.error || 'Error fetching necessary skills'
      );
    }
  }
);

const necessarySkillSlice = createSlice({
  name: 'necessarySkill',
  initialState: {
    necessarySkills: [],
    loading: false,
    error: null,
    necessarySkillDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNecessarySkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNecessarySkills.fulfilled, (state, action) => {
        state.loading = false;
        state.necessarySkills = action.payload;
      })
      .addCase(fetchAllNecessarySkills.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default necessarySkillSlice.reducer;
