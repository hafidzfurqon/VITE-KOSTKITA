import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateProperty = ({ onSuccess, onError}) => {
  return useMutation({
    mutationKey: ['create.property'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.property.create, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
