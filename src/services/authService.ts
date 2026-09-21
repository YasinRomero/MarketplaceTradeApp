import { mockUsers } from "@/mocks/products";
import { User } from "@/types/identity";

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 80));

export async function listMockUsers(): Promise<User[]> {
	await wait();

	return mockUsers.filter((user) => user.isActive).map((user) => ({ ...user }));
}

export async function authenticateMockUser(userId: number): Promise<User> {
	await wait();

	const user = mockUsers.find((candidate) => candidate.id === userId && candidate.isActive);

	if (!user) throw new Error("La cuenta institucional mock no está autorizada.");

	return { ...user };
}

export function isModerator(user: User | null): boolean {
	return user?.role === "moderador" && user.isActive;
}
