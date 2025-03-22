import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdatePropertyRoomType = ({ onSuccess, onError }, id) =>
  useMutation({
    mutationKey: ['update.property-type'],
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`${endpoints.property_room.type.update}/${id}`, {
        ...body,
        _method: 'PUT',
      });
      return response.data;
    },
    onSuccess,
    onError,
  });
