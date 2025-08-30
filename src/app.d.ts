// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: {
				id: string;
				email: string;
				passwordHash: string;
				name: string;
				role: string;
				phone: string;
				resetToken?: string;
				resetTokenExp?: Date;
				createdAt: Date;
				updatedAt: Date;
			} | null;
		}

		interface PageData {
			user?: Locals["user"];
		}
	}
}

export {};
