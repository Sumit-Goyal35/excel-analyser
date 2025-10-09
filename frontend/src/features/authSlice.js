/* eslint-disable no-unused-vars */
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../utils/axiosConfig";

// // ✅ FIXED: Login function
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", {
//         email,
//         password,
//       });

//       // ✅ CRITICAL: Save token to localStorage
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${response.data.token}`;
//       }

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// // ✅ FIXED: Signup function
// export const signupUser = createAsyncThunk(
//   "auth/signup",
//   async ({ name, email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/signup", {
//         name,
//         email,
//         password,
//       });

//       // ✅ CRITICAL: Save token to localStorage
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${response.data.token}`;
//       }

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Signup failed");
//     }
//   }
// );

// // ✅ FIXED: getCurrentUser function
// export const getCurrentUser = createAsyncThunk(
//   "auth/getCurrentUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${token}`;
//       }

//       const response = await axiosInstance.get("/auth/me", { timeout: 10000 });
//       return response.data;
//     } catch (error) {
//       // Clear invalid token
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         delete axiosInstance.defaults.headers.common["Authorization"];
//       }

//       return rejectWithValue({
//         message: error.response?.data?.message || "Authentication failed",
//         shouldSetInitialized: true,
//       });
//     }
//   }
// );

// // ✅ getAllUsers
// export const getAllUsers = createAsyncThunk(
//   "auth/getAllUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${token}`;
//       }

//       const response = await axiosInstance.get("/admin/users", {
//         timeout: 15000,
//       });

//       let users = [];
//       if (response.data) {
//         if (response.data.success && Array.isArray(response.data.users)) {
//           users = response.data.users;
//         } else if (Array.isArray(response.data.users)) {
//           users = response.data.users;
//         } else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }

//       return users;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch users",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// // ✅ toggleUserStatus
// export const toggleUserStatus = createAsyncThunk(
//   "auth/toggleUserStatus",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${token}`;
//       }

//       const response = await axiosInstance.put(
//         `/admin/users/${userId}/toggle-status`
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update user status"
//       );
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     users: [],
//     token: localStorage.getItem("token"),
//     isLoading: false,
//     error: null,
//     isAuthenticated: !!localStorage.getItem("token"),
//     initialized: false,
//     authCheckAttempted: false,
//   },
//   reducers: {
//     forceInitialize: (state) => {
//       state.initialized = true;
//       state.isLoading = false;
//       state.authCheckAttempted = true;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     logout: (state) => {
//       localStorage.removeItem("token");
//       delete axiosInstance.defaults.headers.common["Authorization"];
//       state.user = null;
//       state.users = [];
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       state.initialized = true;
//       state.isLoading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login cases
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.initialized = true;
//         state.authCheckAttempted = true;
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//         state.initialized = true;
//         state.authCheckAttempted = true;
//         state.token = null;
//       })

//       // Signup cases
//       .addCase(signupUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signupUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.initialized = true;
//         state.authCheckAttempted = true;
//         state.error = null;
//       })
//       .addCase(signupUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//         state.initialized = true;
//         state.authCheckAttempted = true;
//         state.token = null;
//       })

//       // getCurrentUser cases
//       .addCase(getCurrentUser.pending, (state) => {
//         state.isLoading = true;
//         state.authCheckAttempted = true;
//       })
//       .addCase(getCurrentUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//         state.initialized = true;
//         state.error = null;
//       })
//       .addCase(getCurrentUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//         state.token = null;
//         state.initialized = true;
//         if (!action.payload?.message?.includes("not authenticated")) {
//           state.error = action.payload?.message || "Authentication failed";
//         }
//       })

//       // getAllUsers cases
//       .addCase(getAllUsers.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getAllUsers.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.users = Array.isArray(action.payload) ? action.payload : [];
//         state.error = null;
//       })
//       .addCase(getAllUsers.rejected, (state, action) => {
//         state.isLoading = false;
//         state.users = [];
//         state.error = action.payload?.message || "Failed to fetch users";
//       })

//       // toggleUserStatus cases
//       .addCase(toggleUserStatus.fulfilled, (state, action) => {
//         const updatedUser = action.payload?.user;
//         if (updatedUser) {
//           state.users = state.users.map((user) =>
//             user._id === updatedUser._id
//               ? { ...user, isActive: updatedUser.isActive }
//               : user
//           );
//         }
//       })
//       .addCase(toggleUserStatus.rejected, (state, action) => {
//         state.error = action.payload || "Failed to update user status";
//       });
//   },
// });

// export const { forceInitialize, clearError, logoutUser } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosConfig";

// ✅ Login function
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Signup function
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// ✅ Get current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      const response = await axiosInstance.get("/auth/me", { timeout: 10000 });
      return response.data;
    } catch (error) {
      // Clear invalid token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
      }

      return rejectWithValue({
        message: error.response?.data?.message || "Authentication failed",
        shouldSetInitialized: true,
      });
    }
  }
);

// ✅ FIXED: Logout function
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Try to call logout API
      try {
        await axiosInstance.post("/auth/logout");
      } catch (error) {
        console.warn(
          "Logout API call failed, but continuing with local cleanup"
        );
      }

      // Always clean up locally regardless of API call result
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];

      return { success: true };
    } catch (error) {
      // Even if everything fails, still clean up
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      return { success: true };
    }
  }
);

// ✅ Get all users (admin)
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      const response = await axiosInstance.get("/admin/users", {
        timeout: 15000,
      });

      let users = [];
      if (response.data) {
        if (response.data.success && Array.isArray(response.data.users)) {
          users = response.data.users;
        } else if (Array.isArray(response.data.users)) {
          users = response.data.users;
        } else if (Array.isArray(response.data)) {
          users = response.data;
        }
      }

      return users;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch users",
        status: error.response?.status || 500,
      });
    }
  }
);

// ✅ Toggle user status
export const toggleUserStatus = createAsyncThunk(
  "auth/toggleUserStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      const response = await axiosInstance.put(
        `/admin/users/${userId}/toggle-status`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    users: [],
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
    initialized: false,
    authCheckAttempted: false,
  },
  reducers: {
    forceInitialize: (state) => {
      state.initialized = true;
      state.isLoading = false;
      state.authCheckAttempted = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ FIXED: Direct logout reducer
    logout: (state) => {
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      state.user = null;
      state.users = [];
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initialized = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
        state.authCheckAttempted = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
        state.authCheckAttempted = true;
        state.token = null;
      })

      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
        state.authCheckAttempted = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
        state.authCheckAttempted = true;
        state.token = null;
      })

      // getCurrentUser cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.authCheckAttempted = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.initialized = true;
        if (!action.payload?.message?.includes("not authenticated")) {
          state.error = action.payload?.message || "Authentication failed";
        }
      })

      // ✅ FIXED: Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.users = [];
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.initialized = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear everything
        state.user = null;
        state.users = [];
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.initialized = true;
        state.isLoading = false;
      })

      // getAllUsers cases
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.users = [];
        state.error = action.payload?.message || "Failed to fetch users";
      })

      // toggleUserStatus cases
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload?.user;
        if (updatedUser) {
          state.users = state.users.map((user) =>
            user._id === updatedUser._id
              ? { ...user, isActive: updatedUser.isActive }
              : user
          );
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update user status";
      });
  },
});

export const { forceInitialize, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
