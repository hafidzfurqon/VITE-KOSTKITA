import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchVisitByCode = (bookingCode) =>
  useQuery({
    queryKey: ['detail-visit'],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.visit.detailCodeVisit}/${bookingCode}`);
      const { data: result } = response.data;
      return result;
    },
  });
