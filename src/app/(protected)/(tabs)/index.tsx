import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import PostListItem from "../../../components/PostListItem";
// import posts from "../../../../assets/data/posts.json";
import { supabase } from "../../../lib/supabase";

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

    setPosts(data);
  };

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}
