import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetailApartement = (id, isOwner) =>
  useQuery({
    queryKey: ['fetch.apartement', id],
    queryFn: async () => {
      if (!id) return null; // Hindari request jika ID tidak ada

      const url = isOwner
        ? `${endpoints.owner.property.detail}/${id}`
        : `${endpoints.apartment.detail}/${id}`;
      const response = await axiosInstance.get(url);
      return response.data.data;
    },
    enabled: !!id,
  });
