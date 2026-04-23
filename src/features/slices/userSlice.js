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
      state.name = action.payload.name;
      state.profileImage = action.payload.photo;
      state.streakCount = action.payload.streak;
      state.totalSessions = action.payload.session;
      state.totalMinutes = action.payload.minutes;
      state.following = action.payload.following;
      state.bio = action.payload.bio;
    },
    updateProfile: (state, action) => {
      const { name, bio, photo } = action.payload;

      if (name !== undefined && name.trim() !== "") {
        state.name = name;
      }

      if (bio !== undefined && bio.trim() !== "") {
        state.bio = bio;
      }

      if (photo !== undefined) {
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
