import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  profileImage: null,
  streakCount: 0,
  totalSessions: 0,
  totalMinutes: 0,
  following: 0,
  bio: "",
  followingTeachers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const data = action.payload || {};
      if (data.name !== undefined) state.name = data.name;
      if (data.photo !== undefined) state.profileImage = data.photo;
      if (data.streak !== undefined) state.streakCount = data.streak;
      if (data.session !== undefined) state.totalSessions = data.session;
      if (data.minutes !== undefined) state.totalMinutes = data.minutes;
      if (data.following !== undefined) state.following = data.following;
      if (data.bio !== undefined) state.bio = data.bio;
    },
    updateProfile: (state, action) => {
      // Only update name / bio / photo — NEVER touch streak, session, minutes
      const { name, bio, photo } = action.payload || {};

      if (name != null && String(name).trim() !== "") {
        state.name = String(name).trim();
      }

      if (bio != null && String(bio).trim() !== "") {
        state.bio = String(bio).trim();
      }

      if (photo != null) {
        state.profileImage = photo;
      }
    },
    toggleFollowTeacher: (state, action) => {
      const teacherId = action.payload;

      const alreadyFollowing = state.followingTeachers.includes(teacherId);

      if (alreadyFollowing) {
        state.followingTeachers = state.followingTeachers.filter(
          (id) => id !== teacherId,
        );
        state.following -= 1;
      } else {
        state.followingTeachers.push(teacherId);
        state.following += 1;
      }
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser, updateProfile, toggleFollowTeacher } =
  userSlice.actions;
export default userSlice.reducer;
