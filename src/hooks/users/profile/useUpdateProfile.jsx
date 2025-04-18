import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateProfile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['update.profile_user'],
    mutationFn: async ({ data }) => {
      const response = await axiosInstance.post(`${endpoints.profile.update}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
