import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatScreen() {

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // LOAD on start
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const data = await AsyncStorage.getItem("CHAT");
    if (data) {
      setMessages(JSON.parse(data));
    }
  };

  const saveMessages = async (msgs) => {
    await AsyncStorage.setItem("CHAT", JSON.stringify(msgs));
  };

  const addMessage = (msg, sender) => {
    return {
      id: Date.now().toString() + Math.random(),
      message: msg,
      sender: sender
    };
  };

  const handleSend = () => {
    if (!text.trim()) return;

    const userMsg = addMessage(text, "user");
    const updated = [...messages, userMsg];

    setMessages(updated);
    saveMessages(updated);

    setText("");

    setTimeout(() => {
      const aiMsg = addMessage(
        "Mock AI: I received → " + userMsg.message,
        "ai"
      );

      const finalMsgs = [...updated, aiMsg];

      setMessages(finalMsgs);
      saveMessages(finalMsgs);

    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
        backgroundColor: item.sender === "user" ? "#bbf7d0" : "#e5e7eb",
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        maxWidth: "80%"
      }}
    >
      <Text>{item.message}</Text>
    </View>
  );

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >

  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <View style={{ flex: 1, padding: 20 }}>

      <FlatList
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10
          }}
          value={text}
          onChangeText={setText}
          placeholder="Type here"
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{
            backgroundColor: "green",
            padding: 10
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}
