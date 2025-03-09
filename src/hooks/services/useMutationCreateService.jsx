import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateService = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['create.service'],
    mutationFn: async (body) => {
      const response = await axiosInstance.post(endpoints.service.create, body);
      return response.data;
    },
    onSuccess,
    onError,
  });
