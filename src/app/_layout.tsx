import {
  AuthLoadingContext,
  type AuthLoadingState,
} from "@/components/auth-loading-context";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import "../../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file");
  }

  const content = <RootContent fontsReady={fontsLoaded || !!fontError} />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {content}
    </ClerkProvider>
  );
}

function RootContent({ fontsReady }: { fontsReady: boolean }) {
  const { isLoaded: authLoaded } = useAuth();
  const [authLoadingState, setAuthLoadingState] =
    useState<AuthLoadingState>("checking");

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <AuthLoadingContext.Provider
      value={{ state: authLoadingState, setState: setAuthLoadingState }}
    >
      {!authLoaded ? (
        <View className="flex-1 items-center justify-center bg-neutral-background">
          <ActivityIndicator size="large" color="#6c4ef5" />
          <Text className="text--body-medium text-neutral-text-secondary mt-4">
            {authLoadingState === "signing-out"
              ? "Signing out..."
              : "Checking your account..."}
          </Text>
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </AuthLoadingContext.Provider>
  );
}
