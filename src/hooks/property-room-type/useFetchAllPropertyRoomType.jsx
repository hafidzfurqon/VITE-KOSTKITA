import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllPropertyRoomType = (isOwner) =>
  useQuery({
    queryKey: ['fetch.property-type'],
    queryFn: async () => {
      const url = isOwner
        ? endpoints.owner.property.property_room.type.list
        : endpoints.property_room.type.list;
      const response = await axiosInstance.get(url);
      return response.data.data;
    },
  });
