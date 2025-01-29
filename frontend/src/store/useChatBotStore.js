import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore";


export const useChatBotStore = create((set, get) => ({
    history: [],
    isHistoryLoading: false,

    getHistory: async () => {
        set({ isHistoryLoading: true })
        try {
            const res = await axiosInstance.get("/messages/history")
            set({ history: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isHistoryLoading: false })
        }

    },
    sendMessageToGeminiAi: async (message) => {
        const { history } = get()

        try {
            //if(selectedUser._id === "6743911c0289edf33641b632")
            const res = await axiosInstance.post('/messages/geminiai', message)
            const { userMessage, aiMessage } = res.data
            console.log('res.data ', res.data)
            //set({ history: [...history, userMessage] })
            //set({ history: [...history, aiMessage] })
            set((state) => ({
                history: [...state.history, userMessage],
            }));
            set((state) => ({
                history: [...state.history, aiMessage],
            }));
            console.log('new history ', history)
        } catch (error) {
            //toast.error(error.response.data.message)
            toast.error('something')
        }
    },

    subscribeToGaminiAiMessages: () => {
        //const { selectedUser } = get();
        // if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessageFromAi", (newMessage) => {
            //const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            //if (!isMessageSentFromSelectedUser) return;

            set({
                history: [...get().history, newMessage],
            });
        });
    },

    unsubscribeFromGaminiAiMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessageFromAi");
    },
}))