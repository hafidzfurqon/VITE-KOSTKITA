import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationStatusVisitUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['mutate.statuss'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.visit_admin.change_data, formData);
      return response;
    },
    onSuccess,
    onError,
  });
};
