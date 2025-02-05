import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllUser = () => useQuery({
    queryKey : ['all.users'],
    queryFn : async () => {
    const response = await axiosInstance.get(endpoints.user.list);
    return response.data
    }
})