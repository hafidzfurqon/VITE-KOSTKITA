import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdatePropertyRoom = ({ onSuccess, onError }, isOwner) =>
  useMutation({
    mutationKey: ['update.property'],
    mutationFn: async (formData) => {
      const url = isOwner
        ? endpoints.owner.property.property_room.update
        : endpoints.property_room.update;
      const response = await axiosInstance.post(url, formData);
      return response.data;
    },
    onSuccess,
    onError,
  });
