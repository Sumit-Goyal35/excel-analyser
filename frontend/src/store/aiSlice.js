import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

// Async thunks
export const generateInsights = createAsyncThunk(
  'ai/generateInsights',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/ai/insights', { fileId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate insights');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    insights: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearInsights: (state) => {
      state.insights = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInsights, clearError } = aiSlice.actions;
export default aiSlice.reducer;
