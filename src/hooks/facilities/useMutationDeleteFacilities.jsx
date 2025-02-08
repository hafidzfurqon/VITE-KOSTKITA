import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeleteFacilities = ({onSuccess, onError}) => useMutation({
    mutationKey : ['delete.fasilitas'],
    mutationFn : async (id) => {
        const response = await axiosInstance.delete(`${endpoints.facilities.delete}/${id}`)
        return response.data
    },
    onSuccess,
    onError
})