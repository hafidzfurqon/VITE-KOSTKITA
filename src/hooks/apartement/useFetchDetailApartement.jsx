import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchDetailApartement = (id) => useQuery({
    queryKey : ['fetch.apartement',id], 
    queryFn : async () => {
        const response = await axiosInstance.get(`${endpoints.apartement.detail}/${id}`)
        return response.data.data
    }
})