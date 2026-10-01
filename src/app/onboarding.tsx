import { images } from "@/constants/images";
import { useAuth } from "@clerk/expo";
import cx from "clsx";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import OnboardingSwiper from "react-native-onboarding-swiper";

const Dot = ({ selected }: { selected: boolean; isLight: boolean }) => (
  <View
    className={cx(
      "mx-2 h-3 rounded-full mb-[200px]",
      selected ? "w-7 bg-[#5b3bf6]" : "w-3 bg-[#d7d9ea]",
    )}
  />
);
const BrandHeader = () => (
  <View className="mb-5 mt-1 flex-row items-center justify-center">
    <Image
      source={images.mascotLogo}
      className="mr-0 h-14 w-14"
      resizeMode="contain"
    />
    <Text className="text-[40px] font-bold tracking-[-2px] text-[#1d2442]">
      lingua
    </Text>
  </View>
);

const SpeechBubble = ({ text, left }: { text: string; left?: boolean }) => (
  <View
    className={cx(
      "absolute rounded-[28px] px-5 py-3 shadow-sm",
      left ? "left-5 top-1 bg-[#eaf2f7]" : "right-5 top-1 bg-[#eef0ff]",
    )}
  >
    <Text className="text-[28px] font-poppins-bold text-neutral-text-primary">
      {text}
    </Text>
  </View>
);

const MascotScene = () => (
  <ScrollView
    className="relative mt-4 w-full"
    contentContainerClassName="items-center justify-center"
    showsVerticalScrollIndicator={false}
  >
    <View className="min-h-[380px] w-full items-center justify-center">
      <SpeechBubble text="Hello!" left />
      <SpeechBubble text="¡Hola!" />
      <Image
        source={images.mascotWelcome}
        className="h-[350px] w-full max-w-[420px]"
        resizeMode="contain"
      />
    </View>
  </ScrollView>
);

const HeroContent = () => (
  <View className="w-full items-center px-4 pb-0">
    <BrandHeader />
    <Text className="text-center text-[50px] font-bold leading-[58px] tracking-[-2px] text-[#1d2442]">
      {"Your AI language\nteacher."}
    </Text>
    <Text className="mt-5 text-center text-[24px] leading-[32px] text-[#2b3350]">
      {"Real conversations, personalized\nlessons, anytime, anywhere."}
    </Text>
    <MascotScene />
  </View>
);

const pages = [
  {
    backgroundColor: "#f6f7fb",
    image: <HeroContent />,
  },
  {
    backgroundColor: "#f6f7fb",
    image: <MascotScene />,
    title: "Speak with confidence.",
    subtitle:
      "Practice real-life phrases and build fluency one lesson at a time.",
    titleStyles: {
      fontSize: 38,
      lineHeight: 46,
      color: "#0d132b",
      fontFamily: "Poppins-Bold",
      textAlign: "center" as const,
    },
    subTitleStyles: {
      fontSize: 19,
      lineHeight: 28,
      color: "#687280",
      fontFamily: "Poppins-Regular",
      marginTop: 8,
      textAlign: "center" as const,
    },
  },
  {
    backgroundColor: "#f6f7fb",
    image: <MascotScene />,
    title: "Stay motivated.",
    subtitle: "Track your streaks, unlock rewards, and keep growing every day.",
    titleStyles: {
      fontSize: 38,
      lineHeight: 46,
      color: "#0d132b",
      fontFamily: "Poppins-Bold",
      textAlign: "center" as const,
    },
    subTitleStyles: {
      fontSize: 19,
      lineHeight: 28,
      color: "#687280",
      fontFamily: "Poppins-Regular",
      marginTop: 8,
      textAlign: "center" as const,
    },
  },
] as const;

export default function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const swiperRef = useRef<OnboardingSwiper>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const isLastPage = currentPage === pages.length - 1;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  const handlePrimaryAction = () => {
    swiperRef.current?.goToPage(currentPage + 1);
  };

  return (
    <View className="flex-1 bg-neutral-surface">
      <OnboardingSwiper
        ref={swiperRef}
        pages={pages as any}
        pageIndexCallback={setCurrentPage}
        showPagination
        showNext={false}
        showDone={false}
        showSkip={false}
        bottomBarHighlight={false}
        bottomBarColor="transparent"
        DotComponent={Dot}
        containerStyles={{
          backgroundColor: "#f6f7fb",
          paddingBottom: 100,
        }}
        imageContainerStyles={{
          paddingBottom: 0,
          marginTop: 0,
        }}
      />

      <View className="absolute inset-x-0 bottom-0 items-center pb-5">
        {isLastPage ? (
          <View className="w-full items-center">
            <Link
              href="/(auth)/sign-up"
              className="w-[94%] flex-row items-center justify-between self-center rounded-[18px] bg-brand-deep-purple px-5 py-4 shadow-md"
            >
              <Text className="flex-1 text-center text-[26px] font-poppins-bold text-white">
                Get Started
              </Text>
            </Link>
            <Link href="/(auth)/sign-in" className="mt-3 py-2">
              <Text className="text-[14px] font-poppins-medium text-neutral-text-secondary">
                Already have an account?{" "}
                <Text className="font-poppins-semibold text-brand-deep-purple">
                  Sign in
                </Text>
              </Text>
            </Link>
          </View>
        ) : (
          <Pressable
            onPress={handlePrimaryAction}
            className="w-[94%] flex-row items-center justify-between self-center rounded-[18px] bg-brand-deep-purple px-5 py-4 shadow-md"
          >
            <Text className="flex-1 text-center text-[26px] font-poppins-bold text-white">
              Next
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
