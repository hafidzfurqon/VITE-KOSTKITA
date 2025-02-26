import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchFacilityPropertyOwner = () => useQuery({
    queryKey : ['fetch.all.property.owner'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.facilities.owner.list)
        return response.data.data
    }
})