import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllPublicApartement = () => useQuery({
    queryKey : ['fetch.apartement.public'], 
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.apartement.public.list)
        return response.data.data
    }
})