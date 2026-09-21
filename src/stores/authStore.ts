import { authenticateMockUser } from "@/services/authService";
import { User } from "@/types/identity";
import { create } from "zustand";

interface AuthStore {
	currentUser: User | null;
	isLoading: boolean;
	error: string | null;
	signInAsMockUser: (userId: number) => Promise<User | null>;
	signOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	currentUser: null,
	isLoading: false,
	error: null,

	signInAsMockUser: async (userId) => {
		set({ isLoading: true, error: null });

		try {
			const user = await authenticateMockUser(userId);
			set({ currentUser: user, isLoading: false });
			return user;
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo iniciar la sesión simulada.",
			});
			return null;
		}
	},

	signOut: () => set({ currentUser: null, error: null }),
}));
