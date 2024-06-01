import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { useColorScheme } from "../libs/useColorScheme";
import { NAV_THEME } from "../libs/constant";
import { PortalHost } from "~/components/primitives/portal";
import GlobalProvider from "~/context/GlobalProvider";

const LIGHT_THEME = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [fontsLoaded, error] = useFonts({
    "BricolageG-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
    "BricolageG-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
    "BricolageG-ExtraBold": require("../assets/fonts/BricolageGrotesque-ExtraBold.ttf"),
    "BricolageG-ExtraLight": require("../assets/fonts/BricolageGrotesque-ExtraLight.ttf"),
    "BricolageG-Light": require("../assets/fonts/BricolageGrotesque-Light.ttf"),
    "BricolageG-Medium": require("../assets/fonts/BricolageGrotesque-Medium.ttf"),
    "BricolageG-SemiBold": require("../assets/fonts/BricolageGrotesque-SemiBold.ttf"),
  });

  React.useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <GlobalProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </GlobalProvider>
  );
}
