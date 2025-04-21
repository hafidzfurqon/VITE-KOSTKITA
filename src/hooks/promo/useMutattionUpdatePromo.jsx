import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdatePromoProperty = ({ onSuccess, onError }, id) =>
  useMutation({
    mutationKey: ['update.promo'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/api/admin/promo/update/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
