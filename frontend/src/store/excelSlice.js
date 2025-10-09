import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosConfig";

export const uploadExcelFile = createAsyncThunk(
  "excel/uploadFile",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Please login to upload files");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/excel/upload", formData, {
        timeout: 60000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        return rejectWithValue("Session expired. Please login again.");
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || "Upload failed"
      );
    }
  }
);

export const fetchUserFiles = createAsyncThunk(
  "excel/fetchUserFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/excel/files");
      if (response.data.success && response.data.files) {
        return response.data.files;
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch files"
      );
    }
  }
);

export const generateChartData = createAsyncThunk(
  "excel/generateChartData",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/excel/generate-chart",
        params
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate chart"
      );
    }
  }
);

const excelSlice = createSlice({
  name: "excel",
  initialState: {
    userFiles: [],
    chartData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearChartData: (state) => {
      state.chartData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userFiles = action.payload || [];
        state.error = null;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.userFiles = [];
        state.error = action.payload;
      })

      .addCase(uploadExcelFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadExcelFile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.file) {
          state.userFiles.unshift(action.payload.file);
        }
        state.error = null;
      })
      .addCase(uploadExcelFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(generateChartData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateChartData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chartData = action.payload;
        state.error = null;
      })
      .addCase(generateChartData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearChartData } = excelSlice.actions;
export default excelSlice.reducer;
