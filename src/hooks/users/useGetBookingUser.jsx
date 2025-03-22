import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useGetBookingUser = () => useQuery({
    queryKey : ['all.booking_user'],
    queryFn : async () => {
    const response = await axiosInstance.get(endpoints.user.booking.getBookingproperty);
    return response.data
    }
})