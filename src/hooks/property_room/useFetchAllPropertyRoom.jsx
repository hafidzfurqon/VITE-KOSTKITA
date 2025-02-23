import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllPropertyRoom = (id) => useQuery({
    queryKey : ['fetch.property-room', id],
    queryFn : async () => {
        const response = await axiosInstance.get(`${endpoints.property_room.detail}/${id}`)
        return response.data.data
    }
})