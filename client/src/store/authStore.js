import { create } from "zustand";

export const authStore = create((set) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],

  setAuthUser: (user) => set({ authUser: user }),
  setSocket: (socket) => set({ socket }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
