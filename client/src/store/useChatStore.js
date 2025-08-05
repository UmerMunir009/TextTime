import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useEffect } from "react";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: true,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data.data });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/${userId}`);
      set({ messages: res.data.data });
      console.log(res.data.data)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

    sendMessage: async (messageData) => {
      const { selectedUser, messages } = get();
      try {
        const res = await axiosInstance.post(`/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

  //   subscribeToMessages: () => {
  //     const { selectedUser } = get();
  //     if (!selectedUser) return;

  //     const socket = useAuthStore.getState().socket;

  //     socket.on("newMessage", (newMessage) => {
  //       const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
  //       if (!isMessageSentFromSelectedUser) return;

  //       set({
  //         messages: [...get().messages, newMessage],
  //       });
  //     });
  //   },

  //   unsubscribeFromMessages: () => {
  //     const socket = useAuthStore.getState().socket;
  //     socket.off("newMessage");
  //   },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
