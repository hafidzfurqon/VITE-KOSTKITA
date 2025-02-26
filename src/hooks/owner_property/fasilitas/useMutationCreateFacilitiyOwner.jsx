import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateFacilitiesOwner = ({onSuccess, onError}) => useMutation({
    mutationKey : ['create.fasilitas'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.facilities.owner.create, body)
        return response.data
    },
    onSuccess,
    onError
})