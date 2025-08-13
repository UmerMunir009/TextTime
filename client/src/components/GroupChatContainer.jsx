import React, { useEffect, useRef, useState } from 'react'
import GroupChatHeader from './GroupChatHeader'
import { useChatStore } from '../store/useChatStore'
import GroupMsgInput from './GroupMsgInput'
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { authStore } from '../store/authStore';
import { formatMessageTime } from "../utils/MessageFormat";

export default function GroupChatContainer() {
  const {
    getGroupMembers,
    selectedGroup,
    getGroupChat,
    groupMessages,
    isMessagesLoading,
    subscribeToGroupMessage,
    unsubscribeToGroupMessage
  } = useChatStore();

  const { authUser } = authStore();
  const messageEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedGroup) {
      getGroupMembers();
      getGroupChat();
    }
    subscribeToGroupMessage();
    return () => unsubscribeToGroupMessage();
  }, [selectedGroup, getGroupChat, subscribeToGroupMessage, unsubscribeToGroupMessage]);

  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  return (
    <div className="relative h-screen overflow-hidden">

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <GroupChatHeader />
      </div>

      {/* Messages container */}
      <div className="overflow-y-auto h-full px-4 space-y-4 pt-[72px] pb-[64px]">
        {isMessagesLoading ? (
          <MessageSkeleton />
        ) : groupMessages.length > 0 ? (
          groupMessages.map((message, index) => {
            const isLastMessage = index === groupMessages.length - 1;
            return (
              <div
                key={index}
                className={`relative chat ${
                  message?.sender.id === authUser?.data?.id
                    ? "chat-end"
                    : "chat-start"
                }`}
                ref={isLastMessage ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img src={message?.sender.profilePic || "/avatar.png"} />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message?.createdAt)}
                  </time>
                </div>

                <div className="chat-bubble flex flex-col relative">
                  {message?.image && (
                    <>
                      <p className="text-[10px] mb-2 text-blue-500">{message?.sender.name}</p>
                      <img
                        src={message?.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                        onClick={() => setSelectedImage(message?.image)}
                      />
                    </>
                  )}
                  {message?.text && (
                    <>
                      <p className="text-[10px] mb-1 text-blue-500">{message?.sender.name}</p>
                      <p className="text-sm sm:text-md">{message?.text}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No messages yet
          </div>
        )}
      </div>

      {/* Fixed input */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-200">
        <GroupMsgInput />
      </div>

      {/* Full image view */}
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
    </div>
  );
}
