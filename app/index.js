import { router, Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { useGlobalContext } from "../context/GlobalProvider";
export default function Page() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Button onPress={() => router.push("/sign-in")} variant="outline">
          <Text>Auth Page</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    fontFamily: "BricolageG-Bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
    fontFamily: "BricolageG-Bold",
  },
});
