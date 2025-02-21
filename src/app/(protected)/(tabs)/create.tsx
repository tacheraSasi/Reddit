import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router } from "expo-router";

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("")
  const [bodyText, setBodyText] = useState<string>("")

  const goBack = () => {
    setTitle("")
    setBodyText("")
    router.back()
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name="close" size={30} color="black" onPress={() => goBack()} />
        <Pressable onPress={() => console.error('Pressed')} style={{ marginLeft: 'auto' }}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 15 }}>
          {/* COMMUNITY SELECTOR */}
          <View style={styles.communityContainer}>
            <Text style={styles.rStyles}>r/</Text>
            <Text style={{ fontWeight: '600' }}>Select a community</Text>
          </View>

          {/* INPUTS */}
          <TextInput
            placeholder="Title"
            style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 20 }}
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
  )
}

const styles = StyleSheet.create({
  postText: {
    color: 'white',
    backgroundColor: '#115BCA',
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10
  },
  rStyles: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: 'bold'
  },
  communityContainer: {
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
    marginVertical: 10
  }
})