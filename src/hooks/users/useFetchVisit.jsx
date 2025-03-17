import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchVisit = () => useQuery({
    queryKey : ['all.visit'],
    queryFn : async () => {
    const response = await axiosInstance.get(endpoints.visit.listVisit);
    return response.data
    }
})