import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { verifyAdminPassword } from "@/lib/password";

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const configured = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const credentialEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (credentialEmail) configured.push(credentialEmail);
  return configured.includes(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google,
    Credentials({
      name: "Email dan kata sandi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata sandi", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (!configuredEmail || email !== configuredEmail) return null;
        if (!(await verifyAdminPassword(password))) return null;
        return { id: email, email, name: "Admin Jelajah Topeng", role: "admin" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.role = isAdminEmail(user?.email) ? "admin" : "user";
      } else if (user) {
        token.role = "role" in user && user.role === "admin" ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith("/dashboard")) return Boolean(session?.user);
      if (pathname === "/login" && session?.user) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      return true;
    },
  },
});
