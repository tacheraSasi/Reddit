import { Tabs } from "expo-router";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { signOut } = useAuth()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerRight: () =>
          <Feather
            name="log-out"
            size={22}
            color="black"
            style={{ paddingRight: 10 }}
            onPress={() => signOut()}
          />
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Reddit',
          headerTintColor: "#FF5700",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <AntDesign name="plus" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}