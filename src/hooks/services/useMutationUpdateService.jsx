import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateService = ({ onSuccess, onError }, id) =>
  useMutation({
    mutationKey: ['update.service'],
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`${endpoints.service.update}/${id}`, body);
      return response.data;
    },
    onSuccess,
    onError,
  });
