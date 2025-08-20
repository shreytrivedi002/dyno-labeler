import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import type { JWT } from "next-auth/jwt";
import type { DefaultSession, User as NextAuthUser } from "next-auth";

type ExtUser = NextAuthUser & { theme?: string };

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				await connectToDatabase();
				const user = await User.findOne({ email: credentials.email });
				if (!user) return null;
				const valid = await compare(credentials.password, user.password);
				if (!valid) return null;
				const extUser: ExtUser = { id: String(user._id), name: user.name, email: user.email, theme: user.theme };
				return extUser;
			},
		}),
	],
	session: { strategy: "jwt" },
	pages: { signIn: "/login" },
	callbacks: {
		async jwt({ token, user }) {
			const t = token as JWT & { userId?: string; theme?: string };
			if (user) {
				const u = user as ExtUser;
				t.userId = u.id as string;
				t.theme = u.theme ?? t.theme ?? "emerald";
			}
			return t;
		},
		async session({ session, token }) {
			const t = token as JWT & { userId?: string; theme?: string };
			if (session.user) {
				const su = session.user as DefaultSession["user"] & { id?: string; theme?: string };
				su.id = t.userId || (token.sub as string | undefined) || undefined;
				su.theme = t.theme ?? "emerald";
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
