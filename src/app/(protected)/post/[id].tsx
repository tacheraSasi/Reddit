import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";

import CommentListItem from "../../../components/CommentListItem";
import PostListItem from "../../../components/PostListItem";
import {
  deletePostById,
  fetchComments,
  fetchPostById,
} from "../../../services/postService";
import { useSupabase } from "../../../lib/supabase";
import comments from "../../../../assets/data/comments.json";

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const inputRef = useRef<TextInput | null>(null);

  const insets = useSafeAreaInsets();

  const queryClient = useQueryClient();
  const supabase = useSupabase();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id, supabase),
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", { postId: id }],
    queryFn: () => fetchComments(id, supabase),
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

  const handleReplyButtonPressed = useCallback((commentId: string) => {
    console.log(commentId);
    inputRef.current?.focus();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !post) {
    return <Text>Post Not Found</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 10}
    >
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

      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentListItem
            comment={item}
            depth={0}
            handleReplyButtonPressed={handleReplyButtonPressed}
          />
        )}
        ListHeaderComponent={<PostListItem post={post} isDetailedPost />}
      />
      <View
        style={{
          paddingBottom: insets.bottom,
          borderBottomColor: "lightgray",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Join the conversation"
          style={{ backgroundColor: "#E4E4E4", padding: 5, borderRadius: 5 }}
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            style={{
              backgroundColor: "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
