import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useUpdateProfile = ({onSuccess, onError}, id) => useMutation({
    mutationKey : ['update.profile_user'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(`${endpoints.user.profile.update}/${id}`, {
            ...body,
            _method : 'PUT'
        }) 
        return response.data
    }, 
    onSuccess,
    onError
})