declare global {
	namespace App {
		interface Locals {
			member?: {
				id: number;
				name: string;
				email: string;
			};
			isAdmin?: boolean;
		}
	}
}

export {};
