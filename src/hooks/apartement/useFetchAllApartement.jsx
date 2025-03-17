import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllApartement = () => useQuery({
    queryKey : ['fetch.apartement'], 
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.apartment.list)
        return response.data.data
    }
})