import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllBooking = () => useQuery({
    queryKey : ['fetch.AllBooking'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.user.booking.admin.list)
        console.log(response.data.data)
        return response.data.data
    }
})