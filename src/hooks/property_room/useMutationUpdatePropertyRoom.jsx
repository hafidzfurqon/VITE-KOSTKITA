import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationUpdatePropertyRoom = ({onSuccess,onError},id) => useMutation({
    mutationKey : ['update.property'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.property_room, {
            property_id : id,
            ...body
        })
        return response.data
    },
    onSuccess,onError
})