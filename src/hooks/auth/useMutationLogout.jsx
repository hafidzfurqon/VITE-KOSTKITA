import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationLogout = ({onSuccess, onError}) => useMutation({
    mutationKey : ['auth.logout'],
    mutationFn : async () => {
        const token_refresh = sessionStorage.getItem('refresh_token');
        const response = await axiosInstance.post(endpoints.auth.logout, {
            refreshToken : token_refresh
        })
        sessionStorage.clear('user_id');
        sessionStorage.clear('token');
        sessionStorage.clear('refresh_token');
        sessionStorage.clear('username');
        return response.data
    },
    onSuccess,
    onError
})