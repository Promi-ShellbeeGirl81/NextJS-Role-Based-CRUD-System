import { NextResponse } from "next/server";
import Task from "@/models/task";
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
        let task = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            console.log("Searching by _id...");
            task = await Task.findById(id);
        }

        if (!task) {
            console.log("Searching by custom id...");
            task = await Task.findOne({ id });
        }

        if (!task) {
            console.log("Task not found");
            return NextResponse.json(
                {
                    message: "Task not found",
                    id,
                    databaseEntries: await Task.find({}),
                },
                { status: 404 }
            );
        }

        console.log("Task found:", task);
        return NextResponse.json(task, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// Backend PUT request
export async function PUT(request) {
    await connectToDatabase();
    const id = await getIdFromRequest(request);
    const { title, description, completed } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    if (!title || !description) {
        // Use NextResponse to return the response
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, completed, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        // Return the updated task with a 200 status code
        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
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
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

