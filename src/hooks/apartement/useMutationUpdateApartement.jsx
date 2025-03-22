import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateApartement = ({ onSuccess, onError }, id, isOwner) =>
  useMutation({
    mutationKey: ['update.promo'],
    mutationFn: async (body) => {
      const url = isOwner
        ? `${endpoints.owner.property.update}/${id}`
        : `${endpoints.apartment.update}/${id}`;
      const response = await axiosInstance.post(url, body);
      return response.data;
    },
    onSuccess,
    onError,
  });
