import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useEffect } from "react";
import { authStore } from "./authStore";

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

  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    try {
      await axiosInstance.post(`/send/${selectedUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // set({ messages: [...messages, res.data.data] });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  },

  subscribeToMessages: () => {
    const socket = authStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const authUserId = authStore.getState().authUser?.data.id;
      const { selectedUser, messages } = get();

      const isSender = newMessage.senderId === authUserId;
      const isReceiver = newMessage.recieverId === authUserId;

      const isChatOpenWithSender = selectedUser?.id === newMessage.senderId;
      const isChatOpenWithReceiver = selectedUser?.id === newMessage.recieverId;

      const shouldUpdateUI =
        (isSender && isChatOpenWithReceiver ) ||
        (isReceiver && isChatOpenWithSender);

      if (!shouldUpdateUI) return;

      set({ messages: [...messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
