import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreatePropertyRoom = ({ onSuccess, onError }, isOwner) =>
  useMutation({
    mutationKey: ['create.room.property'],
    mutationFn: async (body) => {
      const url = isOwner
        ? `${endpoints.owner.property.property_room.add}`
        : `${endpoints.property_room.add}`;
      const response = await axiosInstance.post(url, body);
      return response.data;
    },
    onSuccess,
    onError,
  });
