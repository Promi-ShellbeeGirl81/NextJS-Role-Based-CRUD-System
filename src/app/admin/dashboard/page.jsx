"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-y-3">
        <Link href="/admin/users">
          <button className="px-4 py-2 bg-blue-500 text-white">
            Manage Users
          </button>
        </Link>
      </div>
    </div>
  );
}
