import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllBookingOwner = () =>
  useQuery({
    queryKey: ['fetch.AllBooking'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.owner.property.statistic.booking);
      console.log(response.data.data);
      return response.data.data;
    },
  });
