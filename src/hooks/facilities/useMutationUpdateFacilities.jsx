import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateFacilities = ({ onSuccess, onError }, id) =>
  useMutation({
    mutationKey: ['update.facilities'],
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`${endpoints.facilities.update}/${id}`, {
        ...body,
        _method: 'PUT',
      });
      return response.data;
    },
    onSuccess,
    onError,
  });
