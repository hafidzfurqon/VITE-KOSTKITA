import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateUser = ({ onSuccess,
    onError}) => useMutation({
    mutationKey : ['create.user'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.user.create, body)
        return response.data
    },
    onSuccess,
    onError
})