import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [], // Array of track objects
  recentPlays: [], // Array of track objects (most recent first)
  downloads: [], // Array of track objects
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const track = action.payload;
      const existingIndex = state.favorites.findIndex(
        (t) => t._id === track._id
      );
      if (existingIndex >= 0) {
        state.favorites.splice(existingIndex, 1);
      } else {
        state.favorites.unshift(track);
      }
    },
    addRecentPlay: (state, action) => {
      const track = action.payload;
      // Remove if already in list
      state.recentPlays = state.recentPlays.filter(
        (t) => t._id !== track._id
      );
      // Add to front
      state.recentPlays.unshift(track);
      // Keep only last 20
      if (state.recentPlays.length > 20) {
        state.recentPlays = state.recentPlays.slice(0, 20);
      }
    },
    addDownload: (state, action) => {
      const track = action.payload;
      const exists = state.downloads.find((t) => t._id === track._id);
      if (!exists) {
        state.downloads.unshift(track);
      }
    },
    removeDownload: (state, action) => {
      state.downloads = state.downloads.filter(
        (t) => t._id !== action.payload
      );
    },
  },
});

export const { toggleFavorite, addRecentPlay, addDownload, removeDownload } =
  librarySlice.actions;
export default librarySlice.reducer;
