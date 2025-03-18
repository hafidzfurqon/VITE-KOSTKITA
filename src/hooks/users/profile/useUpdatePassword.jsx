import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdatePassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['update.password_user'],
    mutationFn: async ({ data }) => {
      const response = await axiosInstance.post(`${endpoints.profile.updatePassword}`, data);
      return response.data;
    },
    onError,
    onSuccess,
  });
};
