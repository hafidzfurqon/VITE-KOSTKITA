import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationLogin = ({onSuccess, onError}) => useMutation({
    mutationKey : ['auth.login'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.auth.login, body)
        const {
            success,
            accessToken,
            refreshToken,
            user: { id, name },
          } = response.data;
          if (success) {
            localStorage.setItem('username', name);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user_id', id);
          }
        return response.data
    },
    onSuccess,
    onError
}) 