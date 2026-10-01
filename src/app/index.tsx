import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is authenticated, they should see the home route
        // For now, we'll keep them here since this is the home route
        // In the future, this could redirect to a dedicated home/dashboard screen
      } else {
        // User is not authenticated, redirect to onboarding
        router.replace("/onboarding");
      }
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  // Only show content if authenticated
  if (!isSignedIn) {
    return null;
  }

  return (
    <View className="flex-1 bg-neutral-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="container section">
          <Text className="text--h1 text-neutral-text-primary mb-2">
            Welcome to muolingo
          </Text>
          <Text className="text--body-medium text-neutral-text-secondary">
            Your AI-powered language learning companion
          </Text>
        </View>

        {/* Onboarding Link */}
        <View className="container section">
          <TouchableOpacity
            onPress={() => router.push("/onboarding")}
            className="btn btn--primary items-center justify-center"
          >
            <Text className="text--body-medium text-white">
              View Onboarding
            </Text>
          </TouchableOpacity>
        </View>

        <View className="container section">
          <TouchableOpacity
            onPress={() => signOut()}
            className="btn btn--outline items-center justify-center"
            testID="sign-out-button"
          >
            <Text className="text--body-medium text-brand-purple">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Color Palette Demo */}
        <View className="container section">
          <Text className="text--h2 text-neutral-text-primary mb-4">
            Brand Colors
          </Text>
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 h-20 rounded-xl bg-brand-purple items-center justify-center">
              <Text className="text--caption text-white">Purple</Text>
            </View>
            <View className="flex-1 h-20 rounded-xl bg-brand-blue items-center justify-center">
              <Text className="text--caption text-white">Blue</Text>
            </View>
            <View className="flex-1 h-20 rounded-xl bg-brand-green items-center justify-center">
              <Text className="text--caption text-white">Green</Text>
            </View>
          </View>

          <Text className="text--h2 text-neutral-text-primary mb-4">
            Semantic Colors
          </Text>
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 h-20 rounded-xl bg-semantic-success items-center justify-center">
              <Text className="text--caption text-white">Success</Text>
            </View>
            <View className="flex-1 h-20 rounded-xl bg-semantic-warning items-center justify-center">
              <Text className="text--caption text-neutral-text-primary">
                Warning
              </Text>
            </View>
            <View className="flex-1 h-20 rounded-xl bg-semantic-error items-center justify-center">
              <Text className="text--caption text-white">Error</Text>
            </View>
          </View>
        </View>

        {/* Typography Demo */}
        <View className="container section">
          <Text className="text--h2 text-neutral-text-primary mb-4">
            Typography
          </Text>
          <View className="bg-neutral-surface rounded-xl p-4 mb-3">
            <Text className="text--h1 text-neutral-text-primary mb-2">
              Heading 1 - 32px Bold
            </Text>
            <Text className="text--h2 text-neutral-text-primary mb-2">
              Heading 2 - 24px SemiBold
            </Text>
            <Text className="text--h3 text-neutral-text-primary mb-2">
              Heading 3 - 20px SemiBold
            </Text>
            <Text className="text--h4 text-neutral-text-primary mb-2">
              Heading 4 - 16px Medium
            </Text>
            <Text className="text--body-large text-neutral-text-primary mb-2">
              Body Large - 16px Regular
            </Text>
            <Text className="text--body-medium text-neutral-text-primary mb-2">
              Body Medium - 14px Regular
            </Text>
            <Text className="text--body-small text-neutral-text-primary mb-2">
              Body Small - 13px Regular
            </Text>
            <Text className="text--caption text-neutral-text-secondary">
              Caption - 11px Regular
            </Text>
          </View>
        </View>

        {/* Button Demo */}
        <View className="container section mb-8">
          <Text className="text--h2 text-neutral-text-primary mb-4">
            Buttons
          </Text>
          <View className="gap-3">
            <View className="btn btn--primary items-center justify-center">
              <Text className="text--body-medium text-white">
                Primary Button
              </Text>
            </View>
            <View className="btn btn--secondary items-center justify-center">
              <Text className="text--body-medium text-white">
                Secondary Button
              </Text>
            </View>
            <View className="btn btn--outline items-center justify-center">
              <Text className="text--body-medium text-brand-purple">
                Outline Button
              </Text>
            </View>
            <View className="btn btn--ghost items-center justify-center">
              <Text className="text--body-medium text-brand-purple">
                Ghost Button
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
