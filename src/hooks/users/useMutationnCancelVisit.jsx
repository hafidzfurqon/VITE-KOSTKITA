import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationnCancelVisit = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['cancel.visit'],
    mutationFn: async (data) => {
      const response = await axiosInstance.put(endpoints.user.visit.cancelVisit, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
