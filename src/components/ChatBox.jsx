import { useEffect, useState, useRef } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const socket = io("https://vercel-backend-lone.vercel.app");

const ChatBox = ({ roomId, partnerName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const bgBubble = useColorModeValue("gray.100", "gray.700");
  const myBubble = useColorModeValue("pink.100", "pink.600");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/message/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        roomId,
        sender: user._id,
        content: input,
      });
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box borderWidth={1} borderRadius="lg" p={4} mt={5} bg="white" boxShadow="md">
      <Text
        fontWeight="bold"
        fontSize="lg"
        mb={3}
        bgGradient="linear(to-r, pink.400, purple.500)"
        bgClip="text"
      >
        Chat with {partnerName}
      </Text>

      <VStack
        spacing={3}
        align="stretch"
        h="300px"
        overflowY="auto"
        bg={useColorModeValue("gray.50", "gray.800")}
        p={3}
        borderRadius="lg"
        boxShadow="inner"
      >
        {messages.map((msg, i) => {
          const isMe = msg.sender._id === user._id;
          return (
            <HStack
              key={i}
              alignSelf={isMe ? "flex-end" : "flex-start"}
              spacing={2}
              maxW="80%"
              justify={isMe ? "flex-end" : "flex-start"}
            >
              {!isMe && <Avatar size="sm" name={msg.sender.name} />}
              <Box
                bg={isMe ? myBubble : bgBubble}
                px={4}
                py={2}
                borderRadius="lg"
                shadow="sm"
                transition="all 0.2s"
              >
                <Text fontSize="sm">
                  <strong>{msg.sender.name}</strong>: {msg.content}
                </Text>
              </Box>
            </HStack>
          );
        })}
        <div ref={scrollRef} />
      </VStack>

      <HStack mt={4}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          bg="white"
          shadow="sm"
        />
        <Button colorScheme="pink" onClick={sendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatBox;
