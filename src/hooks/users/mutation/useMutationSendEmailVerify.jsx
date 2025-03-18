import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export const useMutationSendEmailVerify = () =>
  useMutation({
    mutationKey: ['send.email'],
    mutationFn: async (email) => {
      const response = await axiosInstance.post('/api/send_email_verification', {
        email: email,
      });
      return response.data;
    },
  });
