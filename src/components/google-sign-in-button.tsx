import { useSignInWithGoogle } from "@clerk/expo/google";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function GoogleSignInButton({
  onSignInComplete,
  showDivider = true,
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const extra = Constants.expoConfig?.extra;
  const isConfigured =
    Boolean(extra?.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID) &&
    (Platform.OS === "ios"
      ? Boolean(extra?.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID)
      : Boolean(extra?.EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID));

  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      Alert.alert(
        "Google sign-in is not configured",
        "Add the Google client IDs to your .env file and rebuild the native app.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        if (onSignInComplete) {
          onSignInComplete();
        } else {
          router.replace("/");
        }
      }
    } catch (error: unknown) {
      const details =
        typeof error === "object" && error !== null
          ? (error as { code?: string; message?: string })
          : undefined;

      if (details?.code === "SIGN_IN_CANCELLED" || details?.code === "-5") {
        return;
      }

      Alert.alert(
        "Google sign-in failed",
        details?.message || "An error occurred during Google sign-in.",
      );
      console.error("Sign in with Google error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showDivider && (
        <View className="my-5 flex-row items-center">
          <View className="h-px flex-1 bg-neutral-border" />
          <Text className="mx-3 font-poppins-medium text-[12px] text-neutral-text-secondary">
            OR
          </Text>
          <View className="h-px flex-1 bg-neutral-border" />
        </View>
      )}

      <TouchableOpacity
        className="mt-2 flex-row items-center justify-center rounded-2xl border border-neutral-border bg-white py-3"
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        disabled={isLoading}
        onPress={handleGoogleSignIn}
        style={{ opacity: isLoading ? 0.6 : 1 }}
        testID="google-sign-in-button"
      >
        <Text className="mr-3 text-[30px] font-poppins-bold text-[#4285F4]">
          G
        </Text>
        <Text className="font-poppins-semibold text--h4 text-neutral-text-primary mb-0">
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Text>
      </TouchableOpacity>
    </>
  );
}
