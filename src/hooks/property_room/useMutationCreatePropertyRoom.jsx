import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreatePropertyRoom = ({onSuccess,onError}) => useMutation({
    mutationKey : ['create.room.property'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.property_room.add, body)
        return response.data
    },
    onSuccess,
    onError
})