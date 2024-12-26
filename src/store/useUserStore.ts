import { create } from "zustand";

interface UserStore {
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  userName: "",
  setUserName: (name) => set({ userName: name }),
  userEmail: "",
  setUserEmail: (email) => set({ userEmail: email }),
}));

export default useUserStore;
