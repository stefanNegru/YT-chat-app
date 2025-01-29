import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
//import { sendMessage } from "../../../backend/src/controllers/message.controller";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  /* sendMessageToGeminiAi: async (message) => {
     const { selectedUser, messages } = get()
     try {
       //if(selectedUser._id === "6743911c0289edf33641b632")
       const res = await axiosInstance.post('/messages/geminiai', message)
       set({ messages: [...messages, res.data] })
     } catch (error) {
       toast.error(error.response.data.message)
     }
   },*/

  deleteMessage: async (id) => {
    //await axiosInstance.delete(`/messages/${messages[index]._id}`)
    const { messages, selectedUser } = get()
    try {
      const messageToDelete = messages.find((mess) => mess._id === id)
      if (messageToDelete.senderId !== selectedUser._id) {
        const mess = await axiosInstance.delete(`/messages/${id}`)
        set({ messages: messages.filter(message => message._id !== id) })
      }


      //console.log('The message was successfully deleted.', mess)
    } catch (error) {
      toast.error(error.response.data.message)
    }


  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
