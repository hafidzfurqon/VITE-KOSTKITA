import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchPromo = () => useQuery({
    queryKey : ['fetch.promo'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.promo.list)
        return response.data.data
    }
})