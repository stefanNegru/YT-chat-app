import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  inSettings: false,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
  setInSettings: () => {
    const { inSettings } = get()
    set({ inSettings: !inSettings })
  }
}));
