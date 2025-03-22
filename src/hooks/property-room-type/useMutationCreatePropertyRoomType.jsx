import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreatePropertyRoomType = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['create.property-type'],
    mutationFn: async (body) => {
      const response = await axiosInstance.post(endpoints.property_room.type.create, body);
      return response.data;
    },
    onSuccess,
    onError,
  });
