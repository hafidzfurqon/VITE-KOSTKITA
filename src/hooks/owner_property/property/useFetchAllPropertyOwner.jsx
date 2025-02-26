import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllPropertyOwner = () => useQuery({
    queryKey : ['fetch.property.owner'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.property.owner.list)
        return response.data.data
    }
})