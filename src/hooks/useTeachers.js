import { useCallback, useEffect, useState } from "react";
import teacherService from "../services/teacherService";

const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers,
  };
};

export default useTeachers;
