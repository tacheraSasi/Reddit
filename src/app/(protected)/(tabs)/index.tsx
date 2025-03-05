import { FlatList, ActivityIndicator, Text, Button } from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../services/postService";
import { useSupabase } from "../../../lib/supabase";

export default function HomeScreen() {
  const supabase = useSupabase();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam, supabase),
    initialPageParam: { limit: 2, offset: 0 },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return {
        limit: 2,
        offset: allPages.flat().length,
      };
    },
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return <Text>Error fetching posts</Text>;
  }

  const posts = data?.pages.flat() || [];

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
      onRefresh={refetch}
      refreshing={isRefetching}
      onEndReachedThreshold={2}
      onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />
  );
}
