import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeleteFacilities = ({onSuccess, onError}) => useMutation({
    mutationKey : ['delete.property_type'],
    mutationFn : async (id) => {
        const response = await axiosInstance.delete(`${endpoints.property_type.delete}/${id}`)
        return response.data
    },
    onSuccess,
    onError
})