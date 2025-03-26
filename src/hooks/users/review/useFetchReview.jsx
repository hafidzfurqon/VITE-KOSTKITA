import { useQuery } from "@tanstack/react-query";
import axiosInstance, { EndpointLandingPage, endpoints } from "src/utils/axios";

export const useFetchReview = () => useQuery({
    queryKey : ['all.review'],
    queryFn : async () => {
    const response = await axiosInstance.get(EndpointLandingPage.ratingreview.list);
    return response.data.data
    }
})  