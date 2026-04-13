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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendMessageToChat } from "../api/chatapi";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND       = "#0D9268";
const BRAND_DARK  = "#0a7a57";
const BRAND_MID   = "#1db880";
const BRAND_LIGHT = "#E1F5EE";
const BRAND_PALE  = "#f0faf6";
const USER_BUBBLE = "#0D9268";
const BG          = "#F5F7F6";
const SURFACE     = "#FFFFFF";
const TEXT_PRIMARY   = "#0f2419";
const TEXT_SECONDARY = "#5a7a68";
const TEXT_MUTED     = "#a0b8ac";
const BORDER      = "#E3EDE9";

// ─── Quick chips ──────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: "Diet tips",    icon: "nutrition-outline" },
  { label: "Remedies",     icon: "leaf-outline"      },
  { label: "My dosha",     icon: "sunny-outline"     },
  { label: "Yoga poses",   icon: "body-outline"      },
  { label: "Sleep help",   icon: "moon-outline"      },
  { label: "Herbs",        icon: "flower-outline"    },
];

// ─── Typing indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => {
  const dots = [useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current,
                useRef(new Animated.Value(0)).current];

  useEffect(() => {
    dots.forEach((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0,  duration: 280, useNativeDriver: true }),
          Animated.delay(560),
        ])
      ).start()
    );
  }, []);

  return (
    <View style={styles.msgRow}>
      <View style={styles.aiAvatar}>
        <LeafIcon size={16} color="#fff" />
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
};

// ─── Leaf SVG icon (no emoji dependency) ─────────────────────────────────────
const LeafIcon = ({ size = 20, color = BRAND }) => (
  <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
    <View style={{
      width: size * 0.65, height: size * 0.85,
      borderRadius: size * 0.65,
      backgroundColor: color,
      transform: [{ rotate: "-15deg" }],
    }} />
    <View style={{
      position: "absolute",
      width: 1.5, height: size * 0.75,
      backgroundColor: color === "#fff" ? "rgba(255,255,255,0.5)" : BRAND_PALE,
      bottom: 1,
      transform: [{ rotate: "0deg" }],
    }} />
  </View>
);

// ─── Formatted time ───────────────────────────────────────────────────────────
const formatTime = (ts) => {
  const d = new Date(ts);
  const h = d.getHours(), m = d.getMinutes();
  return `${h % 12 || 12}:${m < 10 ? "0" + m : m} ${h >= 12 ? "PM" : "AM"}`;
};

// ─── Message bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ item, showTime, onSuggestionPress }) => {
  const isUser = item.sender === "user";

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
            <LeafIcon size={16} color="#fff" />
          </View>
        )}

        <View style={[styles.bubbleWrapper, isUser && styles.bubbleWrapperUser]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
              {item.message}
            </Text>
            <Text style={[styles.bubbleTime, isUser ? styles.userTime : styles.aiTime]}>
              {formatTime(item.timestamp)}{isUser && "  ✓✓"}
            </Text>
          </View>

          {!isUser && item.suggestions?.length > 0 && (
            <View style={styles.suggestionRow}>
              {item.suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => onSuggestionPress?.(s)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isUser && <View style={styles.userSpacer} />}
      </View>
    </View>
  );
};

// ─── Main chat screen ─────────────────────────────────────────────────────────
export default function ChatScreen() {
  const [text, setText]         = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const inputRef    = useRef(null);

  useEffect(() => { loadMessages(); }, []);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages, isTyping]);

  // ── Persistence ──────────────────────────────────────────────────────────────
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
        persist([welcome]);
      }
    } catch (e) { console.error("loadMessages:", e); }
  };

  const persist = async (msgs) => {
    try { await AsyncStorage.setItem("CHAT_V2", JSON.stringify(msgs)); }
    catch (e) { console.error("persist:", e); }
  };

  // ── Message factory ───────────────────────────────────────────────────────────
  const makeMessage = (msg, sender, suggestions = []) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message: msg,
    sender,
    timestamp: new Date().toISOString(),
    suggestions,
  });

  // ── Send ───────────────────────────────────────────────────────────────────────
  const handleSend = async (overrideText) => {
    const content = (overrideText ?? text).trim();
    if (!content) return;

    const userMsg = makeMessage(content, "user");
    const updated = [...messages, userMsg];
    setMessages(updated);
    persist(updated);
    setText("");
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const userId    = (await AsyncStorage.getItem("USER_ID")) ?? "user1";
      const sessionId = "session1";
      const response  = await sendMessageToChat(content, userId, sessionId);

      const aiText =
        response?.understanding?.message ||
        response?.message ||
        "I'm sorry, I couldn't reach the server. Please try again.";

      const aiMsg = makeMessage(aiText, "ai");
      const final = [...updated, aiMsg];
      setMessages(final);
      persist(final);
    } catch (err) {
      console.error("sendMessage:", err);
      const errMsg = makeMessage(
        "Something went wrong connecting to the server. Please check your connection and try again.",
        "ai"
      );
      setMessages([...updated, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    await AsyncStorage.removeItem("CHAT_V2");
    const welcome = makeMessage(
      "Namaste! 🙏 Starting a fresh conversation. How can I help you today?",
      "ai",
      ["What can you help with?", "My dosha", "Today's routine"]
    );
    setMessages([welcome]);
    persist([welcome]);
  };

  // ── Render item ────────────────────────────────────────────────────────────────
  const renderItem = ({ item, index }) => {
    const showTime =
      index === 0 ||
      new Date(item.timestamp) - new Date(messages[index - 1]?.timestamp) > 60000;
    return (
      <MessageBubble
        item={item}
        showTime={showTime}
        onSuggestionPress={(s) => handleSend(s)}
      />
    );
  };

  // ── UI ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={SURFACE} />

      {/* ── Header — always locked at top, never moves ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <LeafIcon size={20} color="#fff" />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Ayurvedic Assistant</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlinePulse} />
              <Text style={styles.headerOnline}>Online now</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={18} color={TEXT_SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={18} color={TEXT_SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearChat} activeOpacity={0.8}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Quick chips — locked below header, never moves ── */}
      <View style={styles.chipsBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
          keyboardShouldPersistTaps="handled"
        >
          {QUICK_CHIPS.map((chip, i) => (
            <TouchableOpacity
              key={i}
              style={styles.chip}
              onPress={() => handleSend(chip.label)}
              activeOpacity={0.75}
            >
              <Ionicons name={chip.icon} size={13} color={BRAND} />
              <Text style={styles.chipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/*
        ── KeyboardAvoidingView wraps ONLY messages + input ──
        On Android: behavior="padding" + keyboardVerticalOffset=0 is the
        most stable combo. "height" causes the entire view to resize and
        jump, which is what caused the chips bar to vibrate.
        On iOS:     behavior="padding" with offset=0 works because
        SafeAreaView already handles the insets.
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.flex}>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />

            {/* ── Input area ── */}
            <View style={styles.inputArea}>
              <View style={styles.inputRow}>
                <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                  <Ionicons name="add" size={20} color={BRAND} />
                </TouchableOpacity>

                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="Ask about diet, remedies, lifestyle…"
                  placeholderTextColor={TEXT_MUTED}
                  multiline
                  maxLength={500}
                  returnKeyType="send"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSend()}
                />

                <TouchableOpacity
                  style={[styles.sendBtn, !text.trim() && styles.sendBtnOff]}
                  onPress={() => handleSend()}
                  disabled={!text.trim()}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="arrow-up"
                    size={18}
                    color={text.trim() ? "#fff" : TEXT_MUTED}
                  />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SURFACE },
  flex: { flex: 1 },

  // ── Header ──
  header: {
    backgroundColor: SURFACE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
     paddingTop: 40,
  },
  headerLeft:   { flexDirection: "row", alignItems: "center", gap: 10 },
  headerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  onlineDot: {
    position: "absolute", bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: "#34d399",
    borderWidth: 2, borderColor: SURFACE,
  },
  headerTitle: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY, letterSpacing: -0.2 },
  onlineRow:   { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2},
  onlinePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34d399" },
  headerOnline: { fontSize: 11, color: BRAND, fontWeight: "600" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BG, borderWidth: 0.5, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  clearBtn: {
    backgroundColor: "#fff5f5",
    borderWidth: 0.5, borderColor: "#fca5a5",
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
  },
  clearBtnText: { fontSize: 12, fontWeight: "700", color: "#dc2626" },

  // ── Chips ──
  chipsBar: {
    backgroundColor: SURFACE,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  chipsScroll: { paddingHorizontal: 14, paddingVertical: 9, gap: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: BRAND_LIGHT,
    borderWidth: 0.5, borderColor: "#9FE1CB",
    borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontWeight: "600", color: BRAND_DARK },

  // ── Messages ──
  messagesList: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
    flexGrow: 1,
    backgroundColor: BG,
  },
  messageWrapper: { marginBottom: 2 },

  timeDivider: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginVertical: 16,
  },
  timeLine: { flex: 1, height: 0.5, backgroundColor: BORDER },
  timeStamp: { fontSize: 11, color: TEXT_MUTED, fontWeight: "600" },

  msgRow:     { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 10 },
  msgRowUser: { flexDirection: "row-reverse" },

  aiAvatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 2,
  },

  bubbleWrapper:     { maxWidth: "74%", alignItems: "flex-start" },
  bubbleWrapperUser: { alignItems: "flex-end" },
  userSpacer:        { width: 30 },

  bubble:     { borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14 },
  userBubble: { backgroundColor: USER_BUBBLE, borderBottomRightRadius: 4 },
  aiBubble: {
    backgroundColor: SURFACE,
    borderWidth: 0.5, borderColor: BORDER,
    borderBottomLeftRadius: 4,
  },

  bubbleText: { fontSize: 14, lineHeight: 21 },
  userText:   { color: "#fff" },
  aiText:     { color: TEXT_PRIMARY },
  bubbleTime: { fontSize: 10, marginTop: 5 },
  userTime:   { color: "rgba(255,255,255,0.55)", textAlign: "right" },
  aiTime:     { color: TEXT_MUTED },

  suggestionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 7 },
  suggestionChip: {
    backgroundColor: BRAND_LIGHT,
    borderWidth: 0.5, borderColor: "#9FE1CB",
    borderRadius: 12, paddingHorizontal: 11, paddingVertical: 5,
  },
  suggestionText: { fontSize: 12, fontWeight: "600", color: BRAND_DARK },

  // ── Typing ──
  typingBubble: {
    backgroundColor: SURFACE,
    borderWidth: 0.5, borderColor: BORDER,
    borderRadius: 18, borderBottomLeftRadius: 4,
    paddingVertical: 13, paddingHorizontal: 16,
    flexDirection: "row", gap: 5, alignItems: "center",
  },
  typingDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: BORDER,
  },

  // ── Input ──
  inputArea: {
    backgroundColor: SURFACE,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 26,
    paddingHorizontal: 6,
    paddingVertical: 5,
    minHeight: 48,
  },
  attachBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BRAND_LIGHT,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 1,
  },
  input: {
    flex: 1,
    fontSize: 14, color: TEXT_PRIMARY,
    paddingVertical: 6, paddingHorizontal: 2,
    maxHeight: SCREEN_HEIGHT * 0.18,
    lineHeight: 20,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginBottom: 1,
  },
  sendBtnOff: { backgroundColor: BG, borderWidth: 0.5, borderColor: BORDER },

  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6, paddingHorizontal: 6,
  },
  charCount:  { fontSize: 11, color: TEXT_MUTED },
  poweredBy:  { fontSize: 11, color: TEXT_MUTED },
});