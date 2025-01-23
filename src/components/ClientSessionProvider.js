
"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({ session, children }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
