import { useSignInWithApple } from "@clerk/expo/apple";
import {
    AppleAuthenticationButton,
    AppleAuthenticationButtonStyle,
    AppleAuthenticationButtonType,
} from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

interface AppleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

export default function AppleSignInButton({
  onSignInComplete,
  showDivider = true,
}: AppleSignInButtonProps) {
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (Platform.OS !== "ios") {
    return null;
  }

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow();

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

      if (details?.code === "ERR_REQUEST_CANCELED") {
        return;
      }

      Alert.alert(
        "Apple sign-in failed",
        details?.message || "An error occurred during Apple sign-in.",
      );
      console.error("Sign in with Apple error:", error);
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
      <AppleAuthenticationButton
        buttonType={AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={16}
        style={{ width: "100%", height: 48, opacity: isLoading ? 0.6 : 1 }}
        onPress={handleAppleSignIn}
      />
    </>
  );
}
