import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useUpdatePassword = ({onSuccess, onError}, id) => useMutation({
    mutationKey : ['update.password_user'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(`${endpoints.user.profile.updatePassword}/${id}`, {
            ...body,
            _method : 'PUT'
        }) 
        return response.data
    }, 
    onSuccess,
    onError
})