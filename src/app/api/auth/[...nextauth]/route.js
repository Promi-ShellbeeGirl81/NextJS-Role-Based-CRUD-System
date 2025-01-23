import NextAuth from "next-auth";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with the provided email");
          }
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        console.log(`GitHub login: ${profile.email}, ${profile.name}`);
        await connectToDatabase();

        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          await User.create({
            id: profile.id, 
            email: profile.email,
            name: profile.name || profile.login, 
            image: profile.image, 
          });
        }
      }
      if (account?.provider === "google") {
        console.log(`Google login: ${profile.email}, ${profile.name}`);
        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          await User.create({
            id: profile.sub, 
            email: profile.email,
            name: profile.name || "Google User",
            image: profile.picture,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        };
        //console.log("Session user:", session.user);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };