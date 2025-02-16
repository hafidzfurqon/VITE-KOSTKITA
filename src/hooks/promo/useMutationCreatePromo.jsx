import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreatePromo = ({onSuccess,onError}) => useMutation({
    mutationKey : ['create.promo'], 
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.promo.create, body)
        return response.data
    },
    onSuccess,
    onError
})