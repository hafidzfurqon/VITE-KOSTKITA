import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllRoomFacilities = (isOwner) =>
  useQuery({
    queryKey: ['fetch.facilities.room'],
    queryFn: async () => {
      const url = isOwner
        ? `${endpoints.owner.property.facilities_room.list}`
        : `${endpoints.facilities_room.list}`;
      const response = await axiosInstance.get(url);
      return response.data.data;
    },
  });
