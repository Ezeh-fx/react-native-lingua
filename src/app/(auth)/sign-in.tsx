import { images } from "@/constants/images";
import { useSignIn } from "@clerk/expo";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showVerification, setShowVerification] = useState(false);

  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");

    try {
      const { error: signInError } = await signIn.create({
        identifier: email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Sign in failed");
        return;
      }

      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "An error occurred during sign in");
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

          {/* Sign In Button */}
          <TouchableOpacity
            className="bg-lingua-purple rounded-2xl py-4 items-center mt-2"
            activeOpacity={0.85}
            onPress={handleSignIn}
            disabled={!email || !password}
            style={{ opacity: !email || !password ? 0.6 : 1 }}
            testID="sign-in-button"
          >
            <Text className="font-poppins-semibold text-base text-white">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Separator */}
          <View className="mb-6 flex-row items-center">
            <View className="flex-1 h-px bg-neutral-border" />
            <Text className="mx-4 text-[14px] font-poppins-regular text-neutral-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-neutral-border" />
          </View>

          {/* Social Login Buttons */}
          <View className="mb-8 gap-3">
            {/* Google */}
            <Pressable className="flex-row items-center justify-center rounded-xl border border-neutral-border bg-white py-3.5 shadow-sm">
              <FontAwesome5 name="google" size={20} color="#DB4437" />
              <Text className="ml-3 text-[14px] font-poppins-medium text-neutral-text-primary">
                Continue with Google
              </Text>
            </Pressable>

            {/* Facebook */}
            <Pressable className="flex-row items-center justify-center rounded-xl border border-neutral-border bg-white py-3.5 shadow-sm">
              <FontAwesome5 name="facebook" size={20} color="#4267B2" />
              <Text className="ml-3 text-[14px] font-poppins-medium text-neutral-text-primary">
                Continue with Facebook
              </Text>
            </Pressable>

            {/* Apple */}
            <Pressable className="flex-row items-center justify-center rounded-xl border border-neutral-border bg-white py-3.5 shadow-sm">
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text className="ml-3 text-[14px] font-poppins-medium text-neutral-text-primary">
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* Sign Up Link */}
          <View className="items-center">
            <Text className="text-[14px] font-poppins-regular text-neutral-text-secondary">
              Don't have an account?{" "}
              <Link
                href="./sign-up"
                className="font-poppins-semibold text-brand-deep-purple"
              >
                Sign up
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Modal */}
      {/* <VerificationModal
        visible={showVerificationModal}
        email={email}
        onClose={() => setShowVerificationModal(false)}
        onResend={handleResend}
        onVerify={handleVerify}
        error={error}
      /> */}
    </SafeAreaView>
  );
}
