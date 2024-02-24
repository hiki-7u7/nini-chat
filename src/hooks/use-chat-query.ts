import { useInfiniteQuery } from "@tanstack/react-query";

interface UseChatQueryProps {
  groupId: string,
};

export const useChatQuery = ({
  groupId
}: UseChatQueryProps) => {

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = `/api/messages?groupId=${groupId}&cursor=${pageParam}`;
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
    queryKey: [`chat:${groupId}`],
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