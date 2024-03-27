import { useInfiniteQuery } from "@tanstack/react-query";

interface UseChatQueryProps {
  apiUrl: string,
  query: string,
  queryKey: string,
};

export const useChatQuery = ({
  apiUrl,
  query,
  queryKey
}: UseChatQueryProps) => {

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = `${apiUrl}?${query}&cursor=${pageParam}`;
    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: false,
    initialPageParam: undefined,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}