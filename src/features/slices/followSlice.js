import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followedTeachers: [],
};

const followSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    followTeacher: (state, action) => {
      const teacher = action.payload;
      const alreadyFollowing = state.followedTeachers.some(
        (t) => t._id === teacher._id
      );
      if (!alreadyFollowing) {
        state.followedTeachers.push(teacher);
      }
    },
    unfollowTeacher: (state, action) => {
      const teacherId = action.payload;
      state.followedTeachers = state.followedTeachers.filter(
        (t) => t._id !== teacherId
      );
    },
    resetFollows: () => initialState,
  },
});

export const { followTeacher, unfollowTeacher, resetFollows } =
  followSlice.actions;
export default followSlice.reducer;
