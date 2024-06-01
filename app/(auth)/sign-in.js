import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { supabase } from "../../libs/supabase";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    router.replace("/home");
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
            className=""
            onChangeText={(text) => setEmail(text)}
            autoCapitalize={"none"}
          />
          <Input
            placeholder="Password"
            value={password}
            className=""
            onChangeText={(text) => setPassword(text)}
            autoCapitalize={"none"}
          />
        </View>
        <Button
          className="bg-black"
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text className="text-white" style={styles.textMedium}>
            Sign In with Email
          </Text>
        </Button>
        <View className="relative flex justify-center text-xs uppercase mt-5">
          <View className="bg-red px-2 text-muted-foreground">
            <Link href="/sign-up">Don't have an account?</Link>
          </View>
        </View>
        <Text
          style={styles.textRegular}
          className="px-8 text-center text-sm text-muted-foreground"
        >
          By clicking continue, you agree to our
          <Text
            style={styles.textRegular}
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Text>
          <Text>and</Text>
          <Text
            style={styles.textRegular}
            className="underline underline-offset-4 hover:text-primary"
          >
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
  textRegular: {
    fontFamily: "BricolageG-Regular",
  },
});

export default Signin;
