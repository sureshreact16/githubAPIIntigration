import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetHttpCalls = (urls) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const requests = urls.map((url) => axios.get(url));
      const responses = await axios.all(requests);
      if (responses[0].data?.length > 0) {
        const responseData = responses[0].data;
        setData(responseData);
      } else {
        throw new Error("No data received.");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export default useGetHttpCalls;
