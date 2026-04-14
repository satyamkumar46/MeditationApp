import { useEffect, useState } from "react";
import soundService from "../services/soundService";

const useSounds = () => {
  const [categories, setCategories] = useState([]);
  const [allTracks, setAllTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchSounds = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await soundService.getAllSounds();
      setCategories(data);

      // Flatten all tracks with category info
      const tracks = (data || []).flatMap((category) => {
        if (!category?.tracks || !Array.isArray(category.tracks)) return [];
        return category.tracks.map((track) => ({
          ...track,
          catname: category.catname || "Unknown",
          categoryId: category._id,
        }));
      });
      setAllTracks(tracks);
    } catch (err) {
      setError(err.message || "Failed to load sounds");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSounds(),
        new Promise((res) => setTimeout(res, 1500)),
      ]);
    };

    loadData();
  }, []);

  return {
    categories,
    allTracks,
    loading,
    initialLoading,
    error,
    refetch: fetchSounds,
  };
};

export default useSounds;
