import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchVisitByCode = (bookingCode, isAdmin) =>
  useQuery({
    queryKey: ['detail-visit'],
    queryFn: async () => {
      const url = isAdmin
        ? `${endpoints.visit_admin.detailCode}/${bookingCode}`
        : `${endpoints.visit.detailCodeVisit}/${bookingCode}`;
      const response = await axiosInstance.get(url);
      const { data: result } = response.data;
      return result;
    },
  });
