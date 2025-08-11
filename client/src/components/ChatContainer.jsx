import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { authStore } from "../store/authStore";
import { formatMessageTime } from "../utils/MessageFormat";
import { SmilePlus } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = authStore();
  const messageEndRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);
  const [messageReactions, setMessageReactions] = useState({}); // store chosen reactions

  const reactions = ["👍", "❤️", "😂", "😮", "😢"];

  useEffect(() => {
    getMessages(selectedUser.id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser.id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close emoji popup on outside click
  useEffect(() => {
    const closePopup = () => setActiveReactionMsgId(null);
    if (activeReactionMsgId !== null) {
      document.addEventListener("click", closePopup);
      return () => document.removeEventListener("click", closePopup);
    }
  }, [activeReactionMsgId]);

  const handleReactClick = (e, msgId) => {
    e.stopPropagation(); // prevent outside click close
    setActiveReactionMsgId((prev) => (prev === msgId ? null : msgId));
  };

  const handleReactionSelect = (emoji, msgId) => {
    setMessageReactions((prev) => ({
      ...prev,
      [msgId]: emoji,
    }));
    setActiveReactionMsgId(null);
    console.log(`Reacted to message ${msgId} with ${emoji}`);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          return (
            <div
              key={index}
              className={`relative chat ${
                message?.senderId === authUser?.data?.id
                  ? "chat-end"
                  : "chat-start"
              }`}
              ref={isLastMessage ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message?.senderId === authUser?.data?.id
                        ? authUser?.data?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message?.createdAt)}
                </time>
              </div>

              <div className="flex justify-start  items-center gap-2 relative">
                {/* Message Bubble */}
                <div className="chat-bubble flex flex-col relative">
                  {message?.image && (
                    <img
                      src={message?.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                      onClick={() => setSelectedImage(message?.image)}
                    />
                  )}
                  {message?.text && (
                    <p className="text-sm sm:text-md">{message?.text}</p>
                  )}

                  {/* Reaction under message */}
                  {messageReactions[index] && (
                    <span className="absolute -bottom-5 left-2 text-lg bg-white rounded-full shadow px-1">
                      {messageReactions[index]}
                    </span>
                  )}
                </div>

                {/* React Button */}
                <button
                  className="text-xl opacity-60 cursor-pointer hover:opacity-100 transition"
                  onClick={(e) => handleReactClick(e, index)}
                >
                 <SmilePlus/>
                </button>

                {/* Emoji Popup */}
                {activeReactionMsgId === index && (
                  <div
                    className="absolute -top-10 left-0 flex gap-2 bg-white p-2 rounded-full shadow-lg z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reactions.map((emoji, i) => (
                      <button
                        key={i}
                        className="text-xl hover:scale-125 transition-transform"
                        onClick={() => handleReactionSelect(emoji, index)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
