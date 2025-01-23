"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/user/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }

          const user = await res.json();
          console.log(user);
          if (user) {
            setEmail(user.email || "");
            setName(user.name || "");
            setRole(user.role || "");
          } else {
            setError("User not found");
          }
        } catch (error) {
          setError(error.message || "Something went wrong");
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleEditbyId = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !name || !role) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, role }),
      });
      console.log(res);

      const data = await res.json();

      if (res.ok) {
        alert("User updated successfully!");
        router.push("/");
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">Edit User</h2>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error messages */}
      <form onSubmit={handleEditbyId}>
        <div className="mb-2.5">
          <label className="block mb-1.25">Name</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 box-border border border-gray-300"
          />
        </div>
        <div className="mb-2.5">
          <label className="block mb-1.25">Email</label>
          <input
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 box-border border border-gray-300"
          />
        </div>
        <div className="mb-2.5">
          <label className="block mb-1.25">Role</label>
          <select
            value={role || ""}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 box-border border border-gray-300"
          >
            <option value="">Select role</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
          Update User
        </button>
      </form>
    </div>
  );
}
