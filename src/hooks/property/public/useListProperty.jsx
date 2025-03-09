import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useListProperty = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['public.property'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.property.public.list);
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    isFetching,
  };
};

export function useSearchProperty({ name, location, address }) {
  // Ambil nilai pertama yang tersedia untuk search query
  const searchKey = name || location || address;
  const searchParam = name
    ? `name=${encodeURIComponent(name)}`
    : location
      ? `location=${encodeURIComponent(location)}`
      : address
        ? `address=${encodeURIComponent(address)}`
        : '';

  const URL = searchKey ? `${endpoints.property.public.list}?${searchParam}` : null;
  console.log('Search URL:', URL); // Debug URL

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['searchProperty', searchKey],
    queryFn: async () => {
      if (!URL) return null;
      try {
        const response = await axiosInstance.get(URL);
        console.log('Search Response:', response.data); // Debug response
        return response.data.data; // Sama seperti useListProperty
      } catch (err) {
        console.error('Search Error:', err);
        throw new Error('An error occurred while fetching properties.');
      }
    },
    enabled: !!searchKey,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [], // Karena data adalah response.data.data
      searchLoading: isLoading,
      searchError: error,
      searchFetching: isFetching,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isFetching]
  );

  return memoizedValue;
}
