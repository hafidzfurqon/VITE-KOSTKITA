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
  const searchKey = name?.trim() || location?.trim() || address?.trim();

  const searchParam = searchKey ? `search=${encodeURIComponent(searchKey)}` : '';

  const URL = searchKey ? `${endpoints.property.public.list}?${searchParam}` : null;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['searchProperty', searchKey],
    queryFn: async () => {
      if (!URL) return null;
      try {
        const response = await axiosInstance.get(URL);
        return response.data.data || [];
      } catch (err) {
        console.error('Search Error:', err);
        throw new Error('An error occurred while fetching properties.');
      }
    },
    enabled: !!searchKey,
    keepPreviousData: true,
  });

  return useMemo(
    () => ({
      searchResults: data || [],
      searchLoading: isLoading,
      searchError: error,
      searchFetching: isFetching,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isFetching]
  );
}
