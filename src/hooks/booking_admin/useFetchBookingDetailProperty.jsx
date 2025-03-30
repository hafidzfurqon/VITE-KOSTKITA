import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchBookingDetailProperty = (id) =>
  useQuery({
    queryKey: ['detail-booking', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.user.booking.admin.detail}/${id}`);
      console.log(response.data.data);
      return response.data.data;
    },
  });
