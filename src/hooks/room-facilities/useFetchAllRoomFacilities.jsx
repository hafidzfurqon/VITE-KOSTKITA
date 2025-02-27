import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllRoomFacilities = () => useQuery({
    queryKey : ['fetch.facilities.room'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.facilities_room.list)
        return response.data.data
    }
})