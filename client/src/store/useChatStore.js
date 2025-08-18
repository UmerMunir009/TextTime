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
      groupMessages: [],
      users: [],
      groups: [],
      groupMembers: [],
      selectedUser: null,
      selectedGroup: null,
      isUsersLoading: false,
      isMessagesLoading: true,
      isAddingFriend: false,
      isTyping: false,
      isCreatingGroup: false,
      isGroupsLoading: false,
      isAddingMember:false,
      isRemovingMember:false,
      updatingGroupInfo: false,
      updatingGroupInfo: false,
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
          const socket = authStore.getState().socket;
          const user = authStore.getState().authUser?.data;
          const res = await axiosInstance.post("/groups", {
            name,
            description,
            members,
          });
          toast.success(res.data.message);

          socket.emit("group-created", {
            by: user,
            members: members,
            groupId: res?.data?.data?.id,
          });
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
          const res = await axiosInstance.get("/groups");
          set({ groups: res.data.data });
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

      getGroupMembers: async () => {
        try {
          const { selectedGroup } = get();
          const res = await axiosInstance.get(
            `/groups/${selectedGroup?.id}/members`
          );
          set({ groupMembers: res.data.data });
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

      updateGroupInfo: async (formData) => {
        set({ updatingGroupInfo: true });
        try {
          const { selectedGroup } = get();
          const response = await axiosInstance.put(
            `/groups/${selectedGroup?.id}`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          toast.success(response.data.message);
          set((state) => ({
            selectedGroup: {
              ...state.selectedGroup,
              group_icon: response?.data.updated_icon,
            },
          }));
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else if (error.request) {
            toast.error("No response from server.");
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          set({ updatingGroupInfo: false });
        }
      },

      sendGroupMessage: async (formData) => {
        const { selectedGroup,groupMessages } = get();
        try {
          const res=await axiosInstance.post(
            `/groups/${selectedGroup.id}/messages`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          set({ groupMessages: [...groupMessages, res.data.data] });
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

      getGroupChat: async () => {
        set({ isMessagesLoading: true });
        const { selectedGroup } = get();
        try {
          const res = await axiosInstance.get(
            `/groups/${selectedGroup.id}/messages`
          );
          set({ groupMessages: res.data.data });
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

      addNewMember:async (email)=>{
        set({ isAddingMember: true });
        try {
          const {getGroupMembers,selectedGroup,groupMembers}=get()
          const res=await axiosInstance.post(`/groups/${selectedGroup?.id}/members`,{email,groupMembers});
          await getGroupMembers()
          toast.success(res.data.message)
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else if (error.request) {
            toast.error("No response from server.");
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          set({ isAddingMember: false });
        }

      },

      removeMember:async (email)=>{
        set({ isRemovingMember: true });
        try {
          const {getGroupMembers,selectedGroup}=get()
          const res=await axiosInstance.delete(`/groups/${selectedGroup?.id}/members`,{data:{email}});
          await getGroupMembers()

          toast.success(res.data.message)
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else if (error.request) {
            toast.error("No response from server.");
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          set({ isRemovingMember: false });
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

      subscribeToGroupMessage: () => {
        const socket = authStore.getState().socket;
        socket.on("newGroupMsg", (message) => {
          const { groupMessages, selectedGroup } = get();
          const authUserId = authStore.getState().authUser?.data.id;
          const isSender = message?.sender.id === authUserId;
          const isGroupChatOpen = message?.groupId === selectedGroup?.id;
          if (!isGroupChatOpen || isSender) return;
          set({ groupMessages: [...groupMessages, message] });
        });
      },

      unsubscribeToGroupMessage: () => {
        const socket = authStore.getState().socket;
        socket.off("newGroupMsg");
      },

      subscribeToTypingIndicator: () => {
        const socket = authStore.getState().socket;
        const authUserId = authStore.getState().authUser?.data.id;

        socket.on("typing-indicator", ({ from }) => {
          const selectedUser = get().selectedUser;
          if (selectedUser?.id === from && from !== authUserId) {
            set({ isTyping: true });
            setTimeout(() => set({ isTyping: false }), 5000);
          }
        });
      },

      unsubscribeToTypingIndicator: () => {
        const socket = authStore.getState().socket;
        socket.off("typing-indicator");
      },

      setSelectedUser: (selectedUser) => set({ selectedUser }),
      setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

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
        selectedGroup: state.selectedGroup,
      }),
    }
  )
);
