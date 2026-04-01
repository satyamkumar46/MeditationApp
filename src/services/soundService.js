import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

const soundService = {

  async getAllSounds() {
    const response = await apiClient.get(ENDPOINTS.SOUNDS.LIST);
    return response.data;
  },

 
  async getAllTracks() {
    const categories = await this.getAllSounds();
    const tracks = [];
    categories.forEach((category) => {
      category.tracks.forEach((track) => {
        tracks.push({
          ...track,
          catname: category.catname,
          categoryId: category._id,
        });
      });
    });
    return tracks;
  },
};

export default soundService;
