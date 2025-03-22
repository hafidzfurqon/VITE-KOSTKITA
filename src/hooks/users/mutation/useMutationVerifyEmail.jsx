import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';

export const useMutationVerifyEmail = () =>
  useMutation({
    mutationKey: ['mutate.verify.email'],
    mutationFn: async (token) => {
      const response = await axiosInstance.post('/api/verify_email', {
        token: token,
      });
      return response.data;
    },
     onError: (error) => {
      // Handling error jika diperlukan
      console.error('Error verifying email:', error);
    },
    onSuccess: (data) => {
      // Handling sukses jika diperlukan
      console.log('Email verification success:', data);
    }
  });
