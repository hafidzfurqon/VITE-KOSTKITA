import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetailBookedProperty = (id) =>
  useQuery({
    queryKey: ['get.detail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.data_booking.detail}/${id}`);
      console.log(response.data.data)
      return response.data.data;
    },
  });
