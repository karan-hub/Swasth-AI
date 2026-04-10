import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendMessageToChat } from "../api/chatapi";

// ============================================
// QUICK SUGGESTION CHIPS
// ============================================

const QUICK_CHIPS = [
  { label: "Diet tips", icon: "nutrition-outline", color: "#7C3AED", bg: "#F3E8FF", border: "#DDD6FE" },
  { label: "Remedies", icon: "leaf-outline", color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" },
  { label: "My dosha", icon: "sunny-outline", color: "#D97706", bg: "#FEF3C7", border: "#FDE68A" },
  { label: "Yoga poses", icon: "body-outline", color: "#7C3AED", bg: "#F3E8FF", border: "#DDD6FE" },
  { label: "Sleep help", icon: "moon-outline", color: "#059669", bg: "#D1FAE5", border: "#A7F3D0" },
  { label: "Herbs", icon: "flower-outline", color: "#7C3AED", bg: "#F3E8FF", border: "#DDD6FE" },
];

// ============================================
// TYPING INDICATOR with animation
// ============================================

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.aiAvatar}>
        <Text style={styles.aiAvatarText}>🌿</Text>
      </View>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================
// MESSAGE BUBBLE
// ============================================

const MessageBubble = ({ item, showTime, onSuggestionPress }) => {
  const isUser = item.sender === "user";

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m < 10 ? "0" + m : m} ${ampm}`;
  };

  return (
    <View style={styles.messageWrapper}>
      {showTime && (
        <View style={styles.timeDivider}>
          <View style={styles.timeLine} />
          <Text style={styles.timeStamp}>{formatTime(item.timestamp)}</Text>
          <View style={styles.timeLine} />
        </View>
      )}

      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🌿</Text>
          </View>
        )}

        <View style={[styles.bubbleWrapper, isUser && styles.bubbleWrapperUser]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
              {item.message}
            </Text>
            <Text style={[styles.bubbleTime, isUser ? styles.userTime : styles.aiTime]}>
              {formatTime(item.timestamp)}
              {isUser && "  ✓✓"}
            </Text>
          </View>

          {/* AI suggestion chips */}
          {!isUser && item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionRow}>
              {item.suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => onSuggestionPress?.(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// ============================================
// CHAT SCREEN
// ============================================

export default function ChatScreen() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  // ── Persistence ──────────────────────────

  const loadMessages = async () => {
    try {
      const data = await AsyncStorage.getItem("CHAT_V2");
      if (data) {
        setMessages(JSON.parse(data));
      } else {
        const welcome = makeMessage(
          "Namaste! 🙏 I'm your Ayurvedic health assistant.\n\nI'm here to help with personalised diet advice, herbal remedies, daily routines, and wellness guidance based on your unique constitution.",
          "ai",
          ["What can you help with?", "My Vata imbalance", "Morning routine"]
        );
        setMessages([welcome]);
        save([welcome]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const save = async (msgs) => {
    try {
      await AsyncStorage.setItem("CHAT_V2", JSON.stringify(msgs));
    } catch (e) {
      console.error(e);
    }
  };

  // ── Message factory ───────────────────────

  const makeMessage = (msg, sender, suggestions = []) => ({
    id: Date.now().toString() + Math.random(),
    message: msg,
    sender,
    timestamp: new Date().toISOString(),
    suggestions,
  });

  // ── Send ──────────────────────────────────

  const handleSend = async (overrideText) => {
    const content = (overrideText ?? text).trim();
    if (!content) return;

    const userMsg = makeMessage(content, "user");
    const updated = [...messages, userMsg];

    setMessages(updated);
    save(updated);
    setText("");
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const userId = await AsyncStorage.getItem("USER_ID") ?? "user1";
      const sessionId = "session1";

      const response = await sendMessageToChat(content, userId, sessionId);

      const aiText =
        response?.understanding?.message ||
        response?.message ||
        "I'm sorry, I couldn't reach the server. Please try again.";

      const aiMsg = makeMessage(aiText, "ai");
      const final = [...updated, aiMsg];
      setMessages(final);
      save(final);
    } catch (err) {
      console.error(err);
      const errMsg = makeMessage(
        "Something went wrong connecting to the server. Please check your connection and try again.",
        "ai"
      );
      setMessages([...updated, errMsg]);
    }

    setIsTyping(false);
  };

  const handleChipPress = (label) => {
    handleSend(label);
  };

  const handleSuggestionPress = (suggestion) => {
    handleSend(suggestion);
  };

  const clearChat = async () => {
    await AsyncStorage.removeItem("CHAT_V2");
    const welcome = makeMessage(
      "Namaste! 🙏 Starting a fresh conversation. How can I help you today?",
      "ai",
      ["What can you help with?", "My dosha", "Today's routine"]
    );
    setMessages([welcome]);
    save([welcome]);
  };

  // ── Render ────────────────────────────────

  const renderItem = ({ item, index }) => {
    const showTime =
      index === 0 ||
      new Date(item.timestamp) - new Date(messages[index - 1]?.timestamp) > 60000;

    return (
      <MessageBubble
        item={item}
        showTime={showTime}
        onSuggestionPress={handleSuggestionPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>🌿</Text>
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Ayurvedic Assistant</Text>
            <Text style={styles.headerOnline}>● Online now</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Quick chips ── */}
      <View style={styles.chipsOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {QUICK_CHIPS.map((chip, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.chip, { backgroundColor: chip.bg, borderColor: chip.border }]}
              onPress={() => handleChipPress(chip.label)}
            >
              <Ionicons name={chip.icon} size={13} color={chip.color} />
              <Text style={[styles.chipText, { color: chip.color }]}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />

            {/* ── Input ── */}
            <View style={styles.inputArea}>
              <View style={styles.inputWrap}>
                <TouchableOpacity style={styles.attachBtn}>
                  <Ionicons name="attach-outline" size={20} color="#7C3AED" />
                </TouchableOpacity>

                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="Ask about diet, remedies, lifestyle..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  maxLength={500}
                  onSubmitEditing={() => handleSend()}
                  returnKeyType="send"
                  blurOnSubmit
                />

                <TouchableOpacity
                  style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                  onPress={() => handleSend()}
                  disabled={!text.trim()}
                >
                  <Ionicons
                    name="arrow-up"
                    size={18}
                    color={text.trim() ? "#fff" : "#94A3B8"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{text.length} / 500</Text>
                <Text style={styles.poweredBy}>Powered by AyurWell AI</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  flex: { flex: 1 },

  // Background
  bgCircle1: {
    position: "absolute", top: -60, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(124,58,237,0.05)",
  },
  bgCircle2: {
    position: "absolute", top: 300, left: -80,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(16,185,129,0.04)",
  },

  // Header
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#7C3AED",
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  headerAvatarText: { fontSize: 20 },
  onlineDot: {
    position: "absolute", bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2, borderColor: "#fff",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
  headerOnline: { fontSize: 12, color: "#10B981", fontWeight: "600", marginTop: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0",
    alignItems: "center", justifyContent: "center",
  },
  clearBtn: {
    backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA",
    borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7,
  },
  clearBtnText: { fontSize: 12, fontWeight: "700", color: "#DC2626" },

  // Quick chips
  chipsOuter: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  chipsScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontWeight: "700" },

  // Messages
  messagesList: { padding: 16, paddingBottom: 8 },
  messageWrapper: { marginBottom: 4 },

  // Time divider
  timeDivider: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginVertical: 14,
  },
  timeLine: { flex: 1, height: 1, backgroundColor: "#F1F5F9" },
  timeStamp: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },

  // Msg row
  msgRow: {
    flexDirection: "row", alignItems: "flex-end",
    gap: 8, marginBottom: 12,
  },
  msgRowUser: { flexDirection: "row-reverse" },

  // AI avatar
  aiAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#7C3AED",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  aiAvatarText: { fontSize: 15 },

  // Bubble wrapper
  bubbleWrapper: { maxWidth: "74%", alignItems: "flex-start" },
  bubbleWrapperUser: { alignItems: "flex-end" },

  // Bubble
  bubble: { borderRadius: 20, paddingVertical: 11, paddingHorizontal: 15 },
  userBubble: {
    backgroundColor: "#7C3AED",
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#F1F5F9",
    borderBottomLeftRadius: 5,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  userText: { color: "#fff" },
  aiText: { color: "#1E293B" },
  bubbleTime: { fontSize: 11, marginTop: 5, fontWeight: "500" },
  userTime: { color: "rgba(255,255,255,0.6)", textAlign: "right" },
  aiTime: { color: "#94A3B8" },

  // Suggestion chips
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  suggestionChip: {
    backgroundColor: "#F3E8FF", borderWidth: 1, borderColor: "#DDD6FE",
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5,
  },
  suggestionText: { fontSize: 12, fontWeight: "700", color: "#6D28D9" },

  // Typing indicator
  typingRow: {
    flexDirection: "row", alignItems: "flex-end",
    gap: 8, marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#F1F5F9",
    borderRadius: 20, borderBottomLeftRadius: 5,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: "row", gap: 5, alignItems: "center",
  },
  typingDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#CBD5E0",
  },

  // Input area
  inputArea: {
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#F1F5F9",
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12,
  },
  inputWrap: {
    flexDirection: "row", alignItems: "flex-end", gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5, borderColor: "#E2E8F0",
    borderRadius: 24,
    paddingLeft: 6, paddingRight: 6, paddingVertical: 6,
    minHeight: 48,
  },
  attachBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#F3E8FF",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 14, color: "#1E293B",
    maxHeight: 100, paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#7C3AED",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  sendBtnDisabled: { backgroundColor: "#E2E8F0" },
  inputFooter: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 7, paddingHorizontal: 4,
  },
  charCount: { fontSize: 11, color: "#CBD5E0", fontWeight: "500" },
  poweredBy: { fontSize: 11, color: "#CBD5E0", fontWeight: "500" },
});