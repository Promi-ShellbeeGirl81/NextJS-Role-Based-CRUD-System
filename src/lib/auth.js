import bcrypt from 'bcryptjs';
import NextAuthOptions from 'next-auth';
import { connectToDatabase } from "@/lib/mongodb";
import credentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import { signIn } from 'next-auth/react';

export default NextAuthOptions({
    providers: [
        credentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectToDatabase();
                const { email, password } = credentials;
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('No user found with this email address');
                }
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new Error('Incorrect password');
                }
                return { email: user.email, role: user.role, id: user._id, name: user.name };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.SECRET,
    session: {
        jwt: true,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async jwt(token, user) {
          if (user) {
            token.id = user.id;         // Store user ID
            token.email = user.email;   // Store user email
            token.role = user.role;     // Store user role
            token.name = user.name;     // Store user name
            token.picture = user.picture; // Store user picture if available
          }
          console.log("JWT Token:", token);  // Debugging the token
          return token;
        },
      
        async session(session, token) {
          if (token) {
            // Correctly populate the session object with token data
            session.user.id = token.id;         // Set user ID
            session.user.email = token.email;   // Set user email
            session.user.name = token.name;     // Set user name
            session.user.role = token.role;     // Set user role
            session.user.picture = token.picture; // Set user picture if available
          }
          console.log("Session after callback:", session);  // Debugging the session
          return session;
        },
      },          
});
