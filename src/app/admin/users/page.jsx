"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/users/show");
            const data = await res.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
        if (res.ok) {
            setUsers(users.filter((user) => user._id !== id));
        } else {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <ul className="space-y-4">
                {users.map((user) => (
                    <li key={user._id} className="flex justify-between items-center">
                        <div>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                        </div>
                        <div className="space-x-2">
                            <Link href={`/admin/edit-user/${user._id}`}>
                                <button className="px-4 py-2 bg-yellow-500 text-white">Edit</button>
                            </Link>
                            <button
                                onClick={() => deleteUser(user._id)}
                                className="px-4 py-2 bg-red-500 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
