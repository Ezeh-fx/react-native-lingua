import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  email: string;
  isLoading: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  error?: string;
}

export default function VerificationModal({
  visible,
  email,
  isLoading,
  onClose,
  onVerify,
  onResend,
  error,
}: Props) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setCode("");
    onClose();
  };

  const handleCodeChange = async (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const verified = await onVerify(digits);
        if (!verified) {
          setCode("");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResend = async () => {
    setCode("");
    try {
      await onResend();
    } finally {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          {/* Close button */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{"\n"}
            <Text style={styles.emailText}>{email || "your email"}</Text>
          </Text>

          <View className="relative mb-6 w-full flex-row gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isActive = isCodeFocused && code.length === index;
              const isFilled = Boolean(code[index]);

              return (
                <View
                  key={index}
                  className={`h-14 min-w-0 flex-1 items-center justify-center rounded-xl border-2 ${
                    isActive || isFilled
                      ? "border-brand-purple"
                      : "border-neutral-border"
                  } ${isFilled ? "bg-[#f5f2ff]" : "bg-white"}`}
                >
                  <Text className="text-[24px] font-poppins-bold text-neutral-text-primary">
                    {code[index] || ""}
                  </Text>
                </View>
              );
            })}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              accessibilityLabel="6-digit verification code"
              caretHidden
              onFocus={() => setIsCodeFocused(true)}
              onBlur={() => setIsCodeFocused(false)}
              style={styles.codeInput}
            />
          </View>

          {isLoading && isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#6c4ef5" />
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          ) : null}

          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.resendBtn}
            onPress={handleResend}
            disabled={isLoading}
          >
            {isLoading && !isSubmitting ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#6c4ef5" />
                <Text style={styles.resendText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.resendText}>
                {"Didn't receive it? "}
                <Text style={styles.resendLink}>Resend</Text>
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 4,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#001328",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emailText: {
    fontFamily: "Poppins-Medium",
    color: "#001328",
  },
  codeInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.01,
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#ff4d4f",
    textAlign: "center",
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
  },
  resendBtn: {
    paddingVertical: 4,
    marginTop: 8,
  },
  resendText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
  },
  resendLink: {
    fontFamily: "Poppins-Medium",
    color: "#6c4ef5",
  },
});
