import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../libs/supabase";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
const Signup = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    router.replace("/sign-in");
    setLoading(false);
  }

  return (
    <View className="w-full flex justify-center h-full items-cente">
      <View className="flex justify-center items-center">
        <Text style={styles.textBold} className="text-lg ">
          Sign into your account
        </Text>
        <Text style={styles.textBold} className="text-base text-gray-500">
          Enter your email below to create your account
        </Text>
        <View className="grid gap-6 mt-3 bottom-5">
          <Input
            placeholder="Your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            className=""
            autoCapitalize={"none"}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            className=""
            autoCapitalize={"none"}
          />
        </View>
        <Button
          className="bg-black"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text className="text-white">Sign In with Email</Text>
        </Button>
        <View className="relative flex justify-center text-xs uppercase mt-5">
          <View className="bg-red px-2 text-muted-foreground">
            <Link href="/sign-in">Already have an account?</Link>
          </View>
        </View>
        <Text className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our
          <Text className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Text>
          <Text>and</Text>
          <Text className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textBold: {
    fontFamily: "BricolageG-Bold",
  },
  textMedium: {
    fontFamily: "BricolageG-Medium",
  },
});

export default Signup;
