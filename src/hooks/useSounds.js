import { useCallback, useEffect, useState } from "react";
import soundService from "../services/soundService";

const useSounds = () => {
  const [categories, setCategories] = useState([]);
  const [allTracks, setAllTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSounds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await soundService.getAllSounds();
      setCategories(data);

      // Flatten all tracks with category info
      const tracks = [];
      data.forEach((category) => {
        category.tracks.forEach((track) => {
          tracks.push({
            ...track,
            catname: category.catname,
            categoryId: category._id,
          });
        });
      });
      setAllTracks(tracks);
    } catch (err) {
      setError(err.message || "Failed to load sounds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSounds();
  }, [fetchSounds]);

  return {
    categories,
    allTracks,
    loading,
    error,
    refetch: fetchSounds,
  };
};

export default useSounds;
