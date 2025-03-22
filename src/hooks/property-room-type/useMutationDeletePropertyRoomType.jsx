import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeletePropertyRoomType = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['delete.property-type'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.property_room.type.delete}/${id}`);
      return response.data;
    },
    onSuccess,
    onError,
  });
