import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateApartement = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.apartement'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.property.create, body)
        return response.data
    },
    onSuccess,
    onError
})