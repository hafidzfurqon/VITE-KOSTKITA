import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateVisit = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['visit.property'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.user.visit.createVisit, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
