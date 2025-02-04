import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchAllCats = () => useQuery({
  queryKey : ['fetch.cat'],
  queryFn : async () => {
    const response = await axios.get("https://free-cat-api.vercel.app/cats");
    return response.data
  }
  })