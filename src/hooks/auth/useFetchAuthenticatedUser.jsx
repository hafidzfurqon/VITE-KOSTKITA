import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAuthenticatedUser = () => useQuery({
    queryKey : ['authenticated.user'],
    queryFn : async () => {
        const res = await axiosInstance.get(`${endpoints.auth.me}`);
        console.log(res.data.data);
        return res.data.data;
    },
    enabled: false,
    retry : 1
})