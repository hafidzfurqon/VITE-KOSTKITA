import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateTypeProperty = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.property_type'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.property_type.create, body)
        return response.data
    },
    onSuccess,
    onError
})