// src/app/layout.js
import { getServerSession } from "next-auth";
import NextAuthOptions from "@/lib/auth"; 
import ClientSessionProvider from "@/components/ClientSessionProvider"; // Import the client session provider

export default async function RootLayout({ children }) {
  const session = await getServerSession(NextAuthOptions); // Fetch session on the server side

  return (
    <html lang="en">
      <body>
        {/* Wrap the app with ClientSessionProvider to use session client-side */}
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
