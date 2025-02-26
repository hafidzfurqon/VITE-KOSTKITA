import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ['update.profile_user'],
    mutationFn: async ({ data }) => {
      const response = await axiosInstance.post(`${endpoints.user.profile.update}`, data);
      return response.data;
    },
  });
};
