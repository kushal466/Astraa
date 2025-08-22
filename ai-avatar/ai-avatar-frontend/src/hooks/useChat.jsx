// src/hooks/useChat.jsx
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [queue, setQueue] = useState([]);     // upcoming messages
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // 1) Send new user text
  const chat = async (text) => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const { messages } = await res.json();

      if (Array.isArray(messages) && messages.length) {
        // If there is no current message yet, start with the first:
        if (!currentMessage) {
          setCurrentMessage(messages[0]);
          setQueue(messages.slice(1));
        } else {
          // Otherwise queue them for after the current one finishes
          setQueue((q) => [...q, ...messages]);
        }
      }
    } catch (err) {
      console.error("chat() failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2) When the audio finishes, advance to the next in queue
  const onMessagePlayed = () => {
    if (queue.length > 0) {
      setCurrentMessage(queue[0]);
      setQueue((q) => q.slice(1));
    }
    // if queue is empty, we simply keep the currentMessage on-screen
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message: currentMessage,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
