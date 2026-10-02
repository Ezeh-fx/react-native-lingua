import { useSSO } from "@clerk/expo";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

interface FacebookSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function FacebookSignInButton({
  onSignInComplete,
  showDivider = true,
}: FacebookSignInButtonProps) {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_facebook",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        if (onSignInComplete) {
          onSignInComplete();
        } else {
          router.replace("/");
        }
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "An error occurred during Facebook sign-in.";

      Alert.alert("Facebook sign-in failed", message);
      console.error("Sign in with Facebook error:", error);
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
        accessibilityLabel="Continue with Facebook"
        disabled={isLoading}
        onPress={handleFacebookSignIn}
        style={{ opacity: isLoading ? 0.6 : 1 }}
        testID="facebook-sign-in-button"
      >
        <FontAwesome name="facebook" size={23} color="#1877F2" />
        <Text className="ml-3 font-poppins-semibold text--h4 text-neutral-text-primary mb-0">
          {isLoading ? "Signing in..." : "Continue with Facebook"}
        </Text>
      </TouchableOpacity>
    </>
  );
}
