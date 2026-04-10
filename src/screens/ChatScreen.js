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

  StatusBar,
  Animated,
<<<<<<< HEAD
} from "react-native";
import { sendMessageToChat } from '../api/chatapi';
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,

} from 'react-native-safe-area-context';

=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a

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
<<<<<<< HEAD
        const welcomeMsg = addMessage(
          "Namaste 🙏\n\nI'm Swasthya, your personal Ayurvedic wellness companion. I'm here to guide you on your journey to holistic health and balance.",
          "ai"
=======
        const welcome = makeMessage(
          "Namaste! 🙏 I'm your Ayurvedic health assistant.\n\nI'm here to help with personalised diet advice, herbal remedies, daily routines, and wellness guidance based on your unique constitution.",
          "ai",
          ["What can you help with?", "My Vata imbalance", "Morning routine"]
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
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

<<<<<<< HEAD
  const handleSend = async () => {
    if (!text.trim()) return;

    const userMsg = addMessage(text, "user");
    const updated = [...messages, userMsg];

    setMessages(updated);
    saveMessages(updated);
    setText("");
    setIsTyping(true);

    try {
      const storedUserId = await AsyncStorage.getItem("USER_ID");
      const userId = storedUserId ? Number(storedUserId) : 1;
      const sessionId = 1;

      const response = await sendMessageToChat(text, userId, sessionId);

      const aiData = response?.understanding || response;

      const aiMsg = {
        ...addMessage("", "ai"),
        structuredData: typeof aiData === 'object' ? aiData : null,
        message: typeof aiData === 'string' ? aiData : (aiData?.message || "")
      };

      const finalMsgs = [...updated, aiMsg];

      setMessages(finalMsgs);
      saveMessages(finalMsgs);

    } catch (error) {
      console.log(error);
      const errorMsg = addMessage("I'm having trouble connecting right now. Please try again in a moment. 🌿", "ai");
      setMessages([...updated, errorMsg]);
    }

    setIsTyping(false);
  };

  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem("CHAT");
      const welcomeMsg = addMessage(
        "Namaste 🙏\n\nI'm Swasthya, your personal Ayurvedic wellness companion. I'm here to guide you on your journey to holistic health and balance.",
=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
        "ai"
      );
      setMessages([...updated, errMsg]);
    }

    setIsTyping(false);
  };

<<<<<<< HEAD
  const MessageBubble = ({ item, isUser, showTime }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const data = item.structuredData;
    const hasReasons = data?.possible_reasons?.length > 0;
    const hasDoActions = data?.actions?.do_actions?.length > 0;
    const hasDontActions = data?.actions?.dont_actions?.length > 0;
    const hasQuestions = data?.questions_to_ask?.length > 0;
    const hasNotes = data?.notes?.length > 0;

    return (
      <Animated.View
        style={[
          styles.messageWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {showTime && (
          <View style={styles.timestampContainer}>
            <View style={styles.timestampPill}>
              <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
            </View>
          </View>
        )}

        <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
          {!isUser && (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🌿</Text>
              </View>
            </View>
          )}

          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
            {item.message ? (
              <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
                {item.message}
              </Text>
            ) : null}

            {data && (hasReasons || hasDoActions || hasDontActions || hasQuestions || hasNotes) && (
              <View style={styles.structuredContent}>

                {hasReasons && (
                  <View style={styles.reasonsCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.cardIcon}>💭</Text>
                      </View>
                      <Text style={styles.cardTitle}>Possible Causes</Text>
                    </View>
                    <View style={styles.cardBody}>
                      {data.possible_reasons.map((reason, i) => (
                        <View key={i} style={styles.reasonItem}>
                          <View style={styles.reasonDot} />
                          <Text style={styles.reasonText}>{reason}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {(hasDoActions || hasDontActions) && (
                  <View style={styles.carePlanCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.cardIcon}>✨</Text>
                      </View>
                      <Text style={styles.cardTitle}>Your Wellness Plan</Text>
                    </View>
                    <View style={styles.cardBody}>
                      {hasDoActions && data.actions.do_actions.map((action, i) => (
                        <View key={`do-${i}`} style={styles.doAction}>
                          <View style={styles.doIconWrapper}>
                            <Text style={styles.actionIcon}>✓</Text>
                          </View>
                          <Text style={styles.actionText}>{action}</Text>
                        </View>
                      ))}

                      {hasDontActions && data.actions.dont_actions.map((action, i) => (
                        <View key={`dont-${i}`} style={styles.dontAction}>
                          <View style={styles.dontIconWrapper}>
                            <Text style={styles.actionIcon}>✕</Text>
                          </View>
                          <Text style={styles.actionText}>{action}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {hasQuestions && (
                  <View style={styles.questionsCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.cardIcon}>💬</Text>
                      </View>
                      <Text style={styles.cardTitle}>Reflect & Observe</Text>
                    </View>
                    <View style={styles.cardBody}>
                      {data.questions_to_ask.map((q, i) => (
                        <View key={i} style={styles.questionItem}>
                          <View style={styles.questionNumber}>
                            <Text style={styles.questionNumberText}>{i + 1}</Text>
                          </View>
                          <Text style={styles.questionText}>{q}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {hasNotes && (
                  <View style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                      <Text style={styles.noteIcon}>💡</Text>
                      <Text style={styles.noteTitle}>Important Note</Text>
                    </View>
                    <Text style={styles.noteText}>{data.notes[0]}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === "user";
    const showTime =
      index === 0 ||
      (messages[index - 1] &&
        new Date(item.timestamp).getTime() -
        new Date(messages[index - 1].timestamp).getTime() >
        60000);

    return <MessageBubble item={item} isUser={isUser} showTime={showTime} />;
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = (dot, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -8,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animate(dot1, 0);
      animate(dot2, 150);
      animate(dot3, 300);
    }, []);

    if (!isTyping) return null;

    return (
      <View style={styles.messageRow}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🌿</Text>
          </View>
        </View>
        <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
          </View>
        </View>
      </View>
=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />

<<<<<<< HEAD
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatarWrapper}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarEmoji}>🌿</Text>
              </View>
              <View style={styles.statusIndicator} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Swasthya AI</Text>
              <Text style={styles.headerSubtitle}>Ayurvedic Wellness Guide</Text>
            </View>
=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
=======
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
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
<<<<<<< HEAD
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
=======
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
<<<<<<< HEAD
              ListFooterComponent={<TypingIndicator />}
            />

            {/* Input Area */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
=======
              ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            />

            {/* ── Input ── */}
            <View style={styles.inputArea}>
              <View style={styles.inputWrap}>
                <TouchableOpacity style={styles.attachBtn}>
                  <Ionicons name="attach-outline" size={20} color="#7C3AED" />
                </TouchableOpacity>

>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
<<<<<<< HEAD
                  placeholder="Share your concerns..."
                  placeholderTextColor="#a8a29e"
=======
                  placeholder="Ask about diet, remedies, lifestyle..."
                  placeholderTextColor="#94A3B8"
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
                  multiline
                  maxLength={500}
                  onSubmitEditing={() => handleSend()}
                  returnKeyType="send"
                  blurOnSubmit
                />

                <TouchableOpacity
<<<<<<< HEAD
                  onPress={handleSend}
                  style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
=======
                  style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                  onPress={() => handleSend()}
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
                  disabled={!text.trim()}
                  activeOpacity={0.7}
                >
<<<<<<< HEAD
                  <Text style={styles.sendIcon}>→</Text>
=======
                  <Ionicons
                    name="arrow-up"
                    size={18}
                    color={text.trim() ? "#fff" : "#94A3B8"}
                  />
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
                </TouchableOpacity>
              </View>

              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{text.length} / 500</Text>
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
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  flex: {
    flex: 1,
=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
  },

  // Header
  header: {
<<<<<<< HEAD
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e5e4',

  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarEmoji: {
    fontSize: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerText: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#78716c',
    fontWeight: '500',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },

  // Messages
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40, // breathing room above input
  },

  messageWrapper: {
    marginBottom: 16,
  },
  timestampContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timestampPill: {
    backgroundColor: '#f5f5f4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#78716c',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 12,
    paddingTop: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },

  // Bubbles
  bubble: {
    maxWidth: '74%',
    borderRadius: 20,
    padding: 16,
  },
  bubbleUser: {
    backgroundColor: '#22c55e',
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#292524',
  },
  messageTextUser: {
    color: '#fff',
  },

  // Structured Content
  structuredContent: {
    marginTop: 14,
    gap: 12,
    backgroundColor: '#fafafa', // VERY subtle
    borderRadius: 16,
    padding: 12,
  },


  // Cards
  reasonsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  carePlanCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  questionsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1917',
    letterSpacing: -0.2,
  },
  cardBody: {
    gap: 10,
  },

  // Reasons
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8b5cf6',
    marginTop: 8,
    marginRight: 10,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#44403c',
  },

  // Actions
  doAction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  dontAction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(254, 226, 226, 0.4)',
    borderRadius: 12,
    padding: 12,
  },
  doIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dontIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionIcon: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#44403c',
  },

  // Questions
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  questionNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#44403c',
  },

  // Note
  noteCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    letterSpacing: -0.2,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#78350f',
  },

  // Typing
  typingBubble: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d6d3d1',
  },

  // Input
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f4',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1c1917',
    maxHeight: 100,
    paddingVertical: 10,
    paddingRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#47f38fff',
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
=======
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
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
  },
  charCount: { fontSize: 11, color: "#CBD5E0", fontWeight: "500" },
  poweredBy: { fontSize: 11, color: "#CBD5E0", fontWeight: "500" },
});