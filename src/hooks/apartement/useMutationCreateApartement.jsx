import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateApartement = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.promo'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.apartement.create, body)
        return response.data
    },
    onSuccess,
    onError
})