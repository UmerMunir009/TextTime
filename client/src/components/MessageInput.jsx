import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { authStore } from "../store/authStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [picFile, setPicFile] = useState(null);
  const {
    sendMessage,
    isTyping,
    subscribeToTypingIndicator,
    unsubscribeToTypingIndicator,
    selectedUser,
  } = useChatStore();
  const { socket, authUser } = authStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setPicFile(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      formData.append("image", picFile);

      await sendMessage(formData);

      // Clear form
      setText("");
      setImagePreview(null);
      setPicFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    subscribeToTypingIndicator();
    return () => unsubscribeToTypingIndicator();
  }, [subscribeToTypingIndicator, unsubscribeToTypingIndicator]);

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center cursor-pointer"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {isTyping && (
        <div className="text-sm text-green-400 mb-1">
          {selectedUser?.name} is typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              // If timer exists, skip emitting until 5s have passed
              if (!typingTimeoutRef.current) {
                socket.emit("typing", {
                  from: authUser?.data?.id,
                  to: selectedUser?.id,
                });

                // Lock further emits for 5 seconds
                typingTimeoutRef.current = setTimeout(() => {
                  typingTimeoutRef.current = null;
                }, 5000);
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
