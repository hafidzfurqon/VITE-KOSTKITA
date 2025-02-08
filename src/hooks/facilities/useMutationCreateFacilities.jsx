import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateFacilities = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.fasilitas'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.facilities.create, body)
        return response.data
    },
    onSuccess,
    onError
})