import VerificationModal from "@/components/verification-modal";
import { images } from "@/constants/images";
import { useSignUp } from "@clerk/expo";
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
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "Sign up failed");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.message || "Failed to send verification code");
        return;
      }
      setShowVerification(true);
    } catch (err: any) {
      setError(err?.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      setError("");
      const { error: verifyError } = await signUp.verifications.verifyEmailCode(
        {
          code,
        },
      );

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code");
        return false;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.message || "Failed to complete sign up");
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
              Create your account
            </Text>
            <Text className="mt-2 text-[16px] font-poppins-regular text-neutral-text-secondary">
              Start your language journey today ✨
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
          <View className="mb-4">
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

          {/* Password Input */}
          <View className="mb-6">
            <Text className="mb-2 text-[14px] font-poppins-medium text-neutral-text-primary">
              Password
            </Text>
            <View className="flex-row items-center rounded-[10px] border border-neutral-border bg-white">
              <TextInput
                className="flex-1 pl-3 pr-2 text-[16px] font-poppins-regular text-neutral-text-primary"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="px-4 py-3.5"
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color="#687280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg- rounded-2xl bg-brand-deep-purple py-4 items-center mt-2"
            activeOpacity={0.85}
            disabled={!email || !password || isLoading}
            onPress={handleSubmit}
            style={{ opacity: !email || !password || isLoading ? 0.6 : 1 }}
            testID="sign-up-button"
          >
            <Text className="font-poppins-semibold text-base text-white">
              {isLoading ? "Signing up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="items-center">
            <Text className="text-[14px] font-poppins-regular text-neutral-text-secondary">
              Already have an account?{" "}
              <Link
                href="./sign-in"
                className="font-poppins-semibold text-brand-deep-purple"
              >
                Log in
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Verification Modal */}
      <VerificationModal
        visible={showVerification}
        email={email}
        isLoading={isLoading}
        onClose={() => setShowVerification(false)}
        onResend={handleResend}
        onVerify={handleVerify}
        error={error}
      />
    </SafeAreaView>
  );
}
