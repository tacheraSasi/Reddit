import { View, Text, ActivityIndicator, Alert } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import PostListItem from "../../../components/PostListItem";
import { deletePostById, fetchPostById } from "../../../services/postService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../../../lib/supabase";
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";
import React from "react";

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const queryClient = useQueryClient();
  const supabase = useSupabase();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id, supabase),
  });

  const { mutate: remove } = useMutation({
    mutationFn: () => deletePostById(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !data) {
    return <Text>Post Not Found</Text>;
  }

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Entypo
                onPress={() => remove()}
                name="trash"
                size={24}
                color="white"
              />

              <AntDesign name="search1" size={24} color="white" />
              <MaterialIcons name="sort" size={27} color="white" />
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </View>
          ),
          animation: "slide_from_bottom",
        }}
      />
      <PostListItem post={data} isDetailedPost />
    </View>
  );
}
