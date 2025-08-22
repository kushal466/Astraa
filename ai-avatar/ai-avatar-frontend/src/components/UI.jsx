import { useRef } from "react";
import { useChat } from "../hooks/useChat";

export const UI = () => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed } = useChat();

  const sendMessage = () => {
    const text = input.current.value.trim();
    if (text && !loading) {
      chat(text);
      input.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
      {/* Header */}
      <div className="backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg pointer-events-auto self-start">
        <h1 className="font-black text-xl">My Therapy Assistant</h1>
        <p>I will heal you ❤️</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 pointer-events-auto self-end">
        <button
          onClick={() => setCameraZoomed(!cameraZoomed)}
          className="bg-[#ffcc7e] hover:bg-[#fda625] text-black p-4 rounded-md"
        >
          {cameraZoomed ? "Zoom Out" : "Zoom In"}
        </button>
        {/* add more control buttons here if needed */}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto mt-auto">
        <input
          ref={input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="w-full p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md placeholder-gray-800 placeholder-italic"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`bg-[#ffcc7e] hover:bg-[#fda625] text-black p-4 px-10 font-semibold uppercase rounded-md ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
};
