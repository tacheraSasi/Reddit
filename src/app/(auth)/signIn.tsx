import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import {
  Text,
  TextInput,
  Button,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#aaa"
        onChangeText={setEmailAddress}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <View style={styles.signUpContainer}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Link href="/signUp" asChild>
          <TouchableOpacity>
            <Text style={styles.signUpText}> Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: "grey",
  },
  signUpText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
});