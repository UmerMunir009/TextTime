import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { authStore } from "./authStore";
import { formatHeaderTime } from "../utils/HeaderFormat";

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      groups: [],
      selectedUser: null,
      selectedGroup: null,
      isUsersLoading: false,
      isMessagesLoading: true,
      isAddingFriend: false,
      isTyping: false,
      isCreatingGroup: false,
      isGroupsLoading:false,
      lastSeenMap: {},

      getLastSeens: async () => {
        try {
          const lastSeenObj = {};
          const res = await axiosInstance.get("/last-seens");
          res.data.data.forEach((user) => {
            lastSeenObj[user.id] = formatHeaderTime(user.last_seen);
          });
          set({ lastSeenMap: lastSeenObj });
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

      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/users", {
            withCredentials: true,
          });
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
          get().getLastSeens();
          set({ isUsersLoading: false });
        }
      },

      addNewFriend: async (email) => {
        set({ isAddingFriend: true });
        try {
          const res = await axiosInstance.post(
            "/add-new-friend",
            { email },
            { withCredentials: true }
          );
          toast.success(res.data.message);
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
        const { selectedUser } = get();
        try {
          await axiosInstance.post(`/send/${selectedUser.id}`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
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

      createNewGroup: async ({ name, description, members }) => {
        set({ isCreatingGroup: true });
        try {
          const res = await axiosInstance.post("/create-group", {
            name,
            description,
            members,
          });
          toast.success(res.data.message);
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
          set({ isCreatingGroup: false });
        }
      },

      getUserGroups: async () => {
        set({ isGroupsLoading: true });
        try {
          console.log('IN THE FUNCTION')
          const res = await axiosInstance.get("/get-groups");
          console.log(res.data.data);
          set({ groups: res.data.data });
          console.log('FINISHED')
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else if (error.request) {
            toast.error("No response from server.");
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          set({ isGroupsLoading: false });
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

          const shouldUpdateUI =
            isSender || (isReceiver && isChatOpenWithSender);
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

      setLastSeenForUser: (userId, time) =>
        set((state) => ({
          lastSeenMap: {
            ...state.lastSeenMap,
            [userId]: time,
          },
        })),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        selectedUser: state.selectedUser,
      }),
    }
  )
);
