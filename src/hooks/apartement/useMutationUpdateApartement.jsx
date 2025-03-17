import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationUpdateApartement = ({onSuccess, onError}, id) => useMutation({
    mutationKey : ['update.promo'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(`${endpoints.apartment.update}/${id}`, body)
        return response.data
    },
    onSuccess,
    onError
})