import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export const useMutationSendEmailVerify = ({ onSuccess }) =>
  useMutation({
    mutationKey: ['send.email'],
    mutationFn: async (email) => {
      if (!email) throw new Error('Email tidak boleh kosong');
      const response = await axiosInstance.post('/api/send_email_verification', {
        email: email,
      });
      return response.data;
    },
    onSuccess,
  });
