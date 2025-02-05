import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationLogin = ({onSuccess, onError}) => useMutation({
    mutationKey : ['auth.login'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.auth.login, body)
        return response.data
    },
    onSuccess,
    onError
}) 