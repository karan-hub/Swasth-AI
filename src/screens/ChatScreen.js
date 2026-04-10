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
} from "react-native";
import { sendMessageToChat } from '../api/chatapi';
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,

} from 'react-native-safe-area-context';


export default function ChatScreen() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await AsyncStorage.getItem("CHAT");
      if (data) {
        setMessages(JSON.parse(data));
      } else {
        const welcomeMsg = addMessage(
          "Namaste 🙏\n\nI'm Swasthya, your personal Ayurvedic wellness companion. I'm here to guide you on your journey to holistic health and balance.",
          "ai"
        );
        setMessages([welcomeMsg]);
        saveMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const saveMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem("CHAT", JSON.stringify(msgs));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const addMessage = (msg, sender) => {
    return {
      id: Date.now().toString() + Math.random(),
      message: msg,
      sender: sender,
      timestamp: new Date().toISOString(),
    };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

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
        "ai"
      );
      setMessages([welcomeMsg]);
      saveMessages([welcomeMsg]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

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
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafaf9" />

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
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            <FlatList
              ref={flatListRef}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<TypingIndicator />}
            />

            {/* Input Area */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="Share your concerns..."
                  placeholderTextColor="#a8a29e"
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
                  disabled={!text.trim()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sendIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
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
  },
});