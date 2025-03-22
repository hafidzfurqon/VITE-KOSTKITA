import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationAddPromoProperty = ({ onSuccess, onError }, id, isOwner) =>
  useMutation({
    mutationKey: ['add.promo'],
    mutationFn: async (property_id) => {
      const url = isOwner ? `${endpoints.owner.promo.add}` : `${endpoints.promo.add.store}`;
      const response = await axiosInstance.post(url, {
        promo_id: id,
        property_id: property_id,
      });
      return response.data;
    },
    onSuccess,
    onError,
  });
