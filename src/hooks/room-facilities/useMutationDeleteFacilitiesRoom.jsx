import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeleteFacilitiesRoom = ({onSuccess, onError}) => useMutation({
    mutationKey : ['delete.fasilitas.room'],
    mutationFn : async (id) => {
        const response = await axiosInstance.delete(`${endpoints.facilities_room.delete}/${id}`)
        return response.data
    },
    onSuccess,
    onError
})