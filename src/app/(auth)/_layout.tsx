import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    <Redirect href={"/"} />
  }

  return (
    <Stack>
      <Stack.Screen name="signIn" options={{ title: 'Sign In'}} />
      <Stack.Screen name="signUp" options={{ title: 'Sign Up'}} />
    </Stack>
  )
}