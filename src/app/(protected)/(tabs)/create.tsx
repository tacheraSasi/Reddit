import { useState } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { selectedGroupAtom } from "../../../atoms";
import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { TablesInsert } from "../../../types/database.types";

type InsertPost = TablesInsert<"posts">;

const insertPost = async (post: InsertPost) => {
  // use supabase to insert a new post
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [group, setGroup] = useAtom(selectedGroupAtom);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!group) {
        throw new Error("Please select a group");
      }
      if (!title) {
        throw new Error("Title is required");
      }

      return insertPost({
        title,
        description: bodyText,
        group_id: group.id,
        user_id: "073892fd-fb66-46d2-a6d4-09f89fe55244",
      });
    },
    onSuccess: (data) => {
      // invalidate queries that might have been affected by inserting a post
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      goBack();
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Failed to insert post", error.message);
    },
  });

  const goBack = () => {
    setTitle("");
    setBodyText("");
    setGroup(null);
    router.back();
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 10 }}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign
          name="close"
          size={30}
          color="black"
          onPress={() => goBack()}
        />
        <Pressable
          onPress={() => mutate()}
          style={{ marginLeft: "auto" }}
          disabled={isPending}
        >
          <Text style={styles.postText}>
            {isPending ? "Posting..." : "Post"}
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 15 }}
        >
          {/* COMMUNITY SELECTOR */}
          <Link href={"groupSelector"} asChild>
            <Pressable style={styles.communityContainer}>
              {group ? (
                <>
                  <Image
                    source={{ uri: group.image }}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: "600" }}>{group.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rStyles}>r/</Text>
                  <Text style={{ fontWeight: "600" }}>Select a community</Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* INPUTS */}
          <TextInput
            placeholder="Title"
            style={{ fontSize: 20, fontWeight: "bold", paddingVertical: 20 }}
            value={title}
            onChangeText={(text) => setTitle(text)}
            multiline
            scrollEnabled={false}
          />

          <TextInput
            placeholder="body text (optional)"
            value={bodyText}
            onChangeText={(text) => setBodyText(text)}
            multiline
            scrollEnabled={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postText: {
    color: "white",
    backgroundColor: "#115BCA",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  rStyles: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: "bold",
  },
  communityContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
});
