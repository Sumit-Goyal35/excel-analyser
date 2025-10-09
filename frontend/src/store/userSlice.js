import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

// Async thunks
export const fetchUploadHistory = createAsyncThunk(
  'user/fetchUploadHistory',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/upload-history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upload history');
    }
  }
);

export const deleteUpload = createAsyncThunk(
  'user/deleteUpload',
  async (fileId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/users/upload/${fileId}`);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete upload');
    }
  }
);

// Fetch user profile data
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/profile', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Upload history related state
    uploadHistory: [],
    pagination: null,
    totalUploads: 0,
    isLoading: false,
    error: null,
    
    // User profile related state
    profile: null,
    isProfileLoading: false,
    profileError: null,
    
    // Delete operation state
    deletingFileId: null,
    deleteError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.profileError = null;
      state.deleteError = null;
    },
    resetUploadHistory: (state) => {
      state.uploadHistory = [];
      state.pagination = null;
      state.totalUploads = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch upload history
      .addCase(fetchUploadHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUploadHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadHistory = action.payload.uploads || [];
        state.pagination = action.payload.pagination;
        state.totalUploads = action.payload.pagination?.totalUploads || 0;
      })
      .addCase(fetchUploadHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadHistory = [];
        state.pagination = null;
        state.totalUploads = 0;
      })
      
      // Delete upload
      .addCase(deleteUpload.pending, (state, action) => {
        state.deletingFileId = action.meta.arg; // Store which file is being deleted
        state.deleteError = null;
      })
      .addCase(deleteUpload.fulfilled, (state, action) => {
        state.uploadHistory = state.uploadHistory.filter(
          upload => upload.fileId !== action.payload
        );
        state.totalUploads = Math.max(0, state.totalUploads - 1);
        state.deletingFileId = null;
        
        // Update pagination if needed
        if (state.pagination) {
          state.pagination.totalUploads = Math.max(0, state.pagination.totalUploads - 1);
        }
      })
      .addCase(deleteUpload.rejected, (state, action) => {
        state.deleteError = action.payload;
        state.deletingFileId = null;
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.profileError = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearProfileError, 
  clearDeleteError, 
  clearAllErrors, 
  resetUploadHistory 
} = userSlice.actions;

export default userSlice.reducer;

// Selectors for easier access to state
export const selectUploadHistory = (state) => state.user.uploadHistory;
export const selectPagination = (state) => state.user.pagination;
export const selectTotalUploads = (state) => state.user.totalUploads;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;
export const selectUserProfile = (state) => state.user.profile;
export const selectIsProfileLoading = (state) => state.user.isProfileLoading;
export const selectDeletingFileId = (state) => state.user.deletingFileId;
