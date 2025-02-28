import { View, FlatList, ActivityIndicator, Text } from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../services/postService";

export default function HomeScreen() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
    staleTime: 10_000,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return <Text>Error fetching posts</Text>;
  }

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}
