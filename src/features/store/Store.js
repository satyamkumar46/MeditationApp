import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "../slices/librarySlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    library: libraryReducer,
  },
});
