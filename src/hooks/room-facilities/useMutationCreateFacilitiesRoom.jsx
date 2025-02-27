import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationCreateFacilitiesRoom = ({onSuccess,onError}) => useMutation({
    mutationKey : ['create.facilties.room'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.facilities_room.create, body)
        return response.data
    },
    onSuccess,onError
})