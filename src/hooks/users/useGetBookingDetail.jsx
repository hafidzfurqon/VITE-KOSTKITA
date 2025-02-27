import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetBookingDetail = (bookingCode) => useQuery({
    queryKey: ['detail-booking'],  
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.user.booking.getBookingDetail}/${bookingCode}`);  
      const { data: result } = response.data;
      return result;
    },
})
