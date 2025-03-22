import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllPropertyTypeOwner = () => {
  return useQuery({
    queryKey: ['fetch.property_type'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.property_type.owner.list);
      console.log(response.data.data);
      return response?.data?.data;
    },
  });
};
