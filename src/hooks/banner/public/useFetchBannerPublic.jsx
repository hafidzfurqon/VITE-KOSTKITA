import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchBannerPublic = () => useQuery({
    queryKey : ['public.banners'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.banner.public.list)
        return response.data.data
    }
})