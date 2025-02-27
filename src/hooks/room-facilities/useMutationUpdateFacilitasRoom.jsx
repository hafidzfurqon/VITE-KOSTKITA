import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationUpdateFacilitiesRoom = ({onSuccess, onError}, id) =>useMutation({
    mutationKey : ['update.facilitas'],
    mutationFn : async (body) => { 
        const response = await  axiosInstance.post(`${endpoints.facilities_room.update}/${id}`, {
            ...body,
            _method : 'PUT'
        }) 
        return response.data
    },
    onSuccess, onError
})