import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreatePropertyOwner = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.apartement'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.owner.property.create, body)
        return response.data
    },
    onSuccess,
    onError
})