import { NextResponse } from "next/server";
import Task from "@/models/task";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req) {
    await connectToDatabase();
    try {
        // Get the userEmail from the request query params
        const userEmail = req.nextUrl.searchParams.get("userEmail");  // Use searchParams to get query params

        if (!userEmail) {
            return NextResponse.json(
                { message: "User email is required" },
                { status: 400 }
            );
        }

        // Find the user by email to get their ID
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Query tasks by userId
        const tasks = await Task.find({ userId: user._id });

        // Check if tasks exist for the given userId
        if (tasks.length === 0) {
            return NextResponse.json(
                { message: "No tasks found for this user" },
                { status: 200 }
            );
        }

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
