import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeletePropertyRoom = ({onSuccess,onError}, id) => useMutation({
    mutationKey : ['create.room.property'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.property_room.delete, {
            property_id : id,
            property_room_id : body
        })
        return response.data
    },
    onSuccess,
    onError
})