import { View, Text, SafeAreaView, TextInput, FlatList, Pressable, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useState } from "react";
import groups from '../../../assets/data/groups.json'
import { selectedGroupAtom } from "../../atoms";
import { useSetAtom } from "jotai";
import { Group } from "../../types";

export default function GroupSelector() {
  const [searchValue, setSearchValue] = useState<string>("")
  const setGroup = useSetAtom(selectedGroupAtom)

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchValue.toLowerCase()))
  const onGroupSelected = (group: Group) => {
    setGroup(group);
    router.back()
  }

  return (
    <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name="close" size={30} color="black" onPress={() => router.back()} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', flex: 1, paddingRight: 30 }}>Post to</Text>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 5, gap: 5, marginVertical: 10, alignItems: 'center', paddingHorizontal: 5 }}>
        <AntDesign name="search1" size={16} color="gray" />
        <TextInput
          placeholder="Search for a community"
          placeholderTextColor={"grey"}
          style={{ paddingVertical: 10, flex: 1 }}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        {searchValue && (
          <AntDesign name="closecircle" size={15} color="#E4E4E4" onPress={() => setSearchValue("")} />
        )}
      </View>

      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onGroupSelected(item)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 }}
          >
            <Image source={{ uri: item.image }} style={{ width: 40, aspectRatio: 1, borderRadius: 20 }} />
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
};