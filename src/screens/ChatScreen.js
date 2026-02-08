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
} from "react-native";
import { sendMessageToChat } from '../api/chatapi';

import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          "Namaste! 🙏 I'm your Ayurvedic health assistant. How can I help you today?",
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
    const userId = "user1";
    const sessionId = "session1";

    // 🔥 CALL BACKEND HERE
    const response = await sendMessageToChat(text, userId, sessionId);

    console.log("API response:", response);

    const aiText =
      response?.understanding?.message ||
      response?.message ||
      "Sorry, no reply from server.";

    const aiMsg = addMessage(aiText, "ai");

    const finalMsgs = [...updated, aiMsg];

    setMessages(finalMsgs);
    saveMessages(finalMsgs);

  } catch (error) {
    console.log(error);

    const errorMsg = addMessage("Server error 😢", "ai");
    setMessages([...updated, errorMsg]);
  }

  setIsTyping(false);
};


  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem("CHAT");
      const welcomeMsg = addMessage(
        "Namaste! 🙏 I'm your Ayurvedic health assistant. How can I help you today?",
        "ai"
      );
      setMessages([welcomeMsg]);
      saveMessages([welcomeMsg]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === "user";
    const showTime =
      index === 0 ||
      (messages[index - 1] &&
        new Date(item.timestamp).getTime() -
          new Date(messages[index - 1].timestamp).getTime() >
          60000);

    return (
      <View style={styles.messageWrapper}>
        {showTime && (
          <Text style={styles.timeStamp}>{formatTime(item.timestamp)}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {!isUser && (
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>🌿</Text>
            </View>
          )}
          <View
            style={[
              styles.messageContent,
              isUser ? styles.userMessageContent : styles.aiMessageContent,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.aiText,
              ]}
            >
              {item.message}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiIconText}>🌿</Text>
          </View>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🌿</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Ayurvedic Assistant</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={renderTypingIndicator}
            />

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="Ask about diet, remedies, lifestyle..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={[
                    styles.sendButton,
                    !text.trim() && styles.sendButtonDisabled,
                  ]}
                  disabled={!text.trim()}
                >
                  <Text style={styles.sendIcon}>➤</Text>
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
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 40,
  },
  headerIconText: {
    fontSize: 20,
    
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 40,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#10B981",
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
    marginTop: 40,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DC2626",
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  timeStamp: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  messageBubble: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
  },
  aiBubble: {
    alignSelf: "flex-start",
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiIconText: {
    fontSize: 16,
  },
  messageContent: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessageContent: {
    backgroundColor: "#10B981",
  },
  aiMessageContent: {
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#1F2937",
  },
  typingContainer: {
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  sendIcon: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});