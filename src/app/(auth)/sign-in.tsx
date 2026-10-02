import AppleSignInButton from "@/components/apple-sign-in-button";
import FacebookSignInButton from "@/components/facebook-sign-in-button";
import GoogleSignInButton from "@/components/google-sign-in-button";
import VerificationModal from "@/components/verification-modal";
import { images } from "@/constants/images";
import { useSignIn } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const { error: createError } = await signIn.create({
        identifier: email,
      });

      if (createError) {
        setError(createError.message);
        return;
      }

      const { error } = await signIn.emailCode.sendCode({
        emailAddress: email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setShowVerification(true);
    } catch {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      const { error } = await signIn.emailCode.sendCode({
        emailAddress: email,
      });
      if (error) {
        setError(error.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setError("");
      const { error } = await signIn.emailCode.verifyCode({ code });

      if (error) {
        setError(error.message || "Invalid verification code");
        return false;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setError(finalizeError.message || "Failed to complete sign in");
        return false;
      }

      setShowVerification(false);
      router.replace("/");
      return true;
    } catch (err: any) {
      setError(err?.message || "Verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 mt-2 w-12"
          >
            <MaterialIcons name="arrow-back" size={32} color="#0d132b" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-6">
            <Text className="text-[28px] font-poppins-bold text-neutral-text-primary">
              Welcome back
            </Text>
            <Text className="mt-2 text-[16px] font-poppins-regular text-neutral-text-secondary">
              Continue your language journey ✨
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 rounded-lg bg-red-50 p-3">
              <Text className="text-center text-[14px] font-poppins-regular text-red-600">
                {error}
              </Text>
            </View>
          )}

          {/* Illustration */}
          <View className="mb-8 items-center">
            <Image
              source={images.mascotAuth}
              className="h-[200px] w-[200px]"
              resizeMode="contain"
            />
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="mb-2 text-[14px] font-poppins-medium text-neutral-text-primary">
              Email
            </Text>
            <TextInput
              className="rounded-[10px] border border-neutral-border bg-white pl-3 pr-2 py-3.5 text-[16px] font-poppins-regular text-neutral-text-primary"
              placeholder="alex@gmail.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className="bg-brand-deep-purple rounded-2xl py-4 items-center mt-2"
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={!email || isLoading}
            style={{ opacity: !email || isLoading ? 0.6 : 1 }}
            testID="sign-in-button"
          >
            <Text className="font-poppins-semibold text-base text-white">
              {isLoading ? "Sending code..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="items-center mt-3">
            <Text className="text-[14px] font-poppins-regular text-neutral-text-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="./sign-up"
                className="font-poppins-semibold text-brand-deep-purple"
              >
                Sign up
              </Link>
            </Text>
          </View>

          <AppleSignInButton showDivider={Platform.OS === "ios"} />
          <FacebookSignInButton showDivider={Platform.OS !== "ios"} />
          <GoogleSignInButton showDivider={false} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => {
          setShowVerification(false);
          setError(undefined);
        }}
        onResend={handleResend}
        onVerify={handleVerify}
        error={error}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}
