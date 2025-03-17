import { useMutation } from "@tanstack/react-query";
import axiosInstance from "src/utils/axios";

export const useMutationDeleteUser = ({onSuccess,
    onError}) => useMutation({
    mutationKey : ['delete.user'],
    mutationFn : async (id) => {
        const response = await axiosInstance.delete(`/api/admin/users/delete/${id}`)
        return response.data
    },
    onSuccess,
    onError
})