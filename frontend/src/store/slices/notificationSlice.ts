// store/notificationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// --- Thunks (Logic we add) ---

// 1. Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (limit: number) => {
    const res = await axiosInstance.get(`/notification?limit=${limit}`);
    return res.data; // backend sends an array of notifications
  }
);

// 2. Mark single notification as read
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id: string) => {
    await axiosInstance.patch(`/notification/${id}/read`);
    return id; // return the id so reducer can update store
  }
);

// 3. Mark all as read
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAll",
  async () => {
    await axiosInstance.patch("/notification/mark-all");
    return true; // simple flag, reducer will update all
  }
);

// --- Slice (Pre-written part + extra logic) ---
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [] as any[], // notifications array
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })

      // 🔹 Mark single notification
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.list = state.list.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        );
      })

      // 🔹 Mark all notifications
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, read: true }));
      });
  },
});

// ✅ Export reducer
export default notificationSlice.reducer;
