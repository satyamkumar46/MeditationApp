import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  profileImage: null,
  streakCount: 0,
  totalSessions: 0,
  totalMinutes: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    setStreakCount: (state, action) => {
      state.streakCount = action.payload;
    },
    setTotalSessions: (state, action) => {
      state.totalSessions = action.payload;
    },
    setTotalMinutes: (state, action) => {
      state.totalMinutes = action.payload;
    },
    setStreakData: (state, action) => {
      state.streakCount = action.payload.streakCount ?? state.streakCount;
      state.totalSessions = action.payload.totalSessions ?? state.totalSessions;
      state.totalMinutes = action.payload.totalMinutes ?? state.totalMinutes;
    },
    resetUser: () => initialState,
  },
});

export const {
  setName,
  setProfileImage,
  setStreakCount,
  setTotalSessions,
  setTotalMinutes,
  setStreakData,
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
