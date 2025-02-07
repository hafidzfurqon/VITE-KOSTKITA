import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchFacilities = () => useQuery({
    queryKey : ['fetch.facilities'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.facilities.list)
        return response.data.data
    }
})