import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import libraryReducer from "../slices/librarySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    library: libraryReducer,
  },
});
