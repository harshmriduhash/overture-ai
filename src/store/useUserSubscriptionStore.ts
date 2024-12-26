import { create } from "zustand";

export interface UserSubscriptionParams {
  userId: string;
  plan: "FREE" | "PRO" | "UNLIMITED";
  credits: number;
  endDate: Date;
}

interface UserSubscriptionStore {
  userSubscription: UserSubscriptionParams | null;
  setUserSubscription: (subscription: UserSubscriptionParams) => void;
}

const useUserSubscriptionStore = create<UserSubscriptionStore>((set) => ({
  userSubscription: null,
  setUserSubscription: (subscription: UserSubscriptionParams) =>
    set({ userSubscription: subscription }),
}));

export default useUserSubscriptionStore;
