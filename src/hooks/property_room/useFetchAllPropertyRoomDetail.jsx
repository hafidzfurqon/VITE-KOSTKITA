import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllPropertyRoomDetail = (id, isOwner) =>
  useQuery({
    queryKey: ['fetch.property-room-detail', id],
    queryFn: async () => {
      if (!id) return null; // Hindari request jika ID tidak ada

      const url = isOwner
        ? `${endpoints.owner.property.property_room.detail}/${id}`
        : `${endpoints.property_room.details.property_room_detail}/${id}`;

      const response = await axiosInstance.get(url);
      return response.data.data;
    },
    enabled: !!id, // Pastikan query hanya berjalan jika ID tersedia
  });
