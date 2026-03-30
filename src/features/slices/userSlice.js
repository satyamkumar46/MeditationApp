import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  profileImage: null,
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
  },
});

export const { setName, setProfileImage } = userSlice.actions;
export default userSlice.reducer;
