import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueUsername } from "@/lib/username";

const adapter: Adapter = {
  ...PrismaAdapter(prisma),
  createUser: async (d) =>
    (await prisma.user.create({
      data: {
        email: d.email,
        image: d.image,
        displayName: d.name,
        emailVerified: d.emailVerified,
        username: await uniqueUsername(d.email.split("@")[0]),
      },
    })) as never,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(c) {
        const p = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse(c);
        if (!p.success) return null;
        const u = await prisma.user.findUnique({ where: { email: p.data.email.toLowerCase() } });
        if (!u?.passwordHash || !(await bcrypt.compare(p.data.password, u.passwordHash))) return null;
        return { id: u.id, email: u.email, name: u.displayName, image: u.image };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.id) token.uid = user.id;
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.uid as string;
      return session;
    },
  },
});
