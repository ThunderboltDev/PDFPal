import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		sessionToken: string;
		userId: string;
		expires: string;
		userAgent?: string;
		createdAt: Date;
		updatedAt: Date;
		user: DefaultSession["user"];
	}
}
