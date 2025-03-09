import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeletePromo = ({onSuccess, onError}) => useMutation({
    mutationKey : ['delete.promo'],
    mutationFn : async (id) => {
        const response = await axiosInstance.delete(`${endpoints.promo.delete}/${id}`)
        return response.data
    },
    onSuccess,
    onError
})