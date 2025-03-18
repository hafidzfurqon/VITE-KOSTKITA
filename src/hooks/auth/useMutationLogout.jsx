import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationLogout = ({onSuccess, onError}) => useMutation({
    mutationKey : ['auth.logout'],
    mutationFn : async () => {
        const token_refresh = localStorage.getItem('refresh_token');
        const response = await axiosInstance.post(endpoints.auth.logout, {
            refreshToken : token_refresh
        })
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        return response.data
    },
    onSuccess,
    onError
})