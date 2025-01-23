import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

async function getIdFromRequest(request) {
    const { pathname } = request.nextUrl;
    return pathname.split("/").pop();
}

export async function GET(request) {
    await connectToDatabase();
    const id = await getIdFromRequest(request);
    console.log("Query ID:", id);

    try {
        let user = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            console.log("Searching by _id...");
            user = await User.findById(id);
        }

        if (!user) {
            console.log("Searching by custom id...");
            user = await User.findOne({ id });
        }

        if (!user) {
            console.log("User not found");
            return NextResponse.json(
                {
                    message: "User not found",
                    id,
                    databaseEntries: await User.find({}),
                },
                { status: 404 }
            );
        }

        console.log("User found:", user);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    await connectToDatabase();
    const id = await getIdFromRequest(request);
    const { email, name, role } = await request.json(); // Update to match the fields you're using

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Ensure email, name, and role are provided
    if (!email || !name || !role) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        // Update the user with the new values
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { email, name, role, updatedAt: new Date() }, // Use the fields you're updating
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Return the updated user with a 200 status code
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(request) {
    await connectToDatabase();
    const id = await getIdFromRequest(request);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

