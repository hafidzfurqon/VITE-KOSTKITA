import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationLogout = ({onSuccess, onError}) => useMutation({
    mutationKey : ['auth.logout'],
    mutationFn : async () => {
        const response = await axiosInstance.post(endpoints.auth.logout)
        return response.data
    },
    onSuccess,
    onError
})