import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const getAudio = (id) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await supabase.from("memos").select().eq("creator", `${id}`);
      setData(res);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default getAudio;
