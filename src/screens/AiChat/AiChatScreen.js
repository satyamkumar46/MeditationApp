import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { sendMessageToAI } from "../../api/chatapi";
import { moderateScale, scale, verticalScale } from "../../utility/helpers";

export default function AiChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi 👋 I'm your meditation assistant. How are you feeling today?",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input;

    setInput("");
    setIsTyping(true);

    try {
      const data = await sendMessageToAI(currentMessage);

      const aiReply = {
        id: `ai-${Date.now()}-${Math.random()}`,
        text: data.reply,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString,
        text: "Unable to respond right now 🌿",
        sender: "ai",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.aiContainer,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AI Assistant</Text>

        <View style={{ width: 22 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.aiContainer}>
              <View style={[styles.bubble, styles.aiBubble]}>
                <Text style={styles.messageText}>Typing...</Text>
              </View>
            </View>
          ) : null
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your thoughts..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Feather name="send" size={18} color="#112116" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112116",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(70),
    paddingBottom: verticalScale(15),
  },
  headerTitle: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  chatContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(10),
  },

  messageContainer: {
    marginVertical: verticalScale(6),
  },

  userContainer: {
    alignItems: "flex-end",
  },

  aiContainer: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
  },

  userBubble: {
    backgroundColor: "#20DF60",
  },

  aiBubble: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#20DF6033",
  },

  messageText: {
    color: "#fff",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(35),
    borderTopWidth: 1,
    borderColor: "#20DF6026",
    backgroundColor: "#112116",
  },

  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    color: "#fff",
    fontSize: moderateScale(14),
  },

  sendBtn: {
    marginLeft: scale(10),
    backgroundColor: "#20DF60",
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
