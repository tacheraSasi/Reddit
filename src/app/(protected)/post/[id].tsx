import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PostListItem from "../../../components/PostListItem";
import { fetchPostById } from "../../../services/postService";
import { useQuery } from "@tanstack/react-query";

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !data) {
    return <Text>Post Not Found</Text>;
  }

  return (
    <View>
      <PostListItem post={data} isDetailedPost />
    </View>
  );
}
