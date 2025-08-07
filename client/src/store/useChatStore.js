import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { authStore } from "./authStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: true,
  isAddingFriend: false,
  isTyping: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users", { withCredentials: true });
      set({ users: res.data.data });
      console.log(res.data.data);
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

  addNewFriend: async (email) => {
    set({ isAddingFriend: true });
    try {
      console.log(email);
      const res = await axiosInstance.post(
        "/add-new-friend",
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      console.log(res.data.data);
      get().getUsers();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      set({ isAddingFriend: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/${userId}`, {
        withCredentials: true,
      });
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
      console.log(formData);
      await axiosInstance.post(`/send/${selectedUser.id}`, formData, {
        withCredentials: true,
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

  //this is used to show the real-time update in UI i msg sent without refreshing the page
  subscribeToMessages: () => {
    const socket = authStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const authUserId = authStore.getState().authUser?.data.id;
      const { selectedUser, messages } = get();

      const isSender = newMessage.senderId === authUserId;
      const isReceiver = newMessage.recieverId === authUserId;

      const isChatOpenWithSender = selectedUser?.id === newMessage.senderId;

      const shouldUpdateUI = isSender || (isReceiver && isChatOpenWithSender);

      if (!shouldUpdateUI) return;

      set({ messages: [...messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },
  subscribeToTypingIndicator: () => {
    const socket = authStore.getState().socket;
    const authUserId = authStore.getState().authUser?.data.id;

    socket.on("typing-indicator", ({ from }) => {
      const selectedUser = get().selectedUser;

      if (selectedUser?.id === from && from !== authUserId) {
        set({ isTyping: true });

        setTimeout(() => set({ isTyping: false }), 2500);
      }
    });
  },
  unsubscribeToTypingIndicator: () => {
    const socket = authStore.getState().socket;
    socket.off("typing-indicator");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
