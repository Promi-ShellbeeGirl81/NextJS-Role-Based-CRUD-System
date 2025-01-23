import { getServerSession } from "next-auth";
import NextAuthOptions from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/task";
import User from "@/models/user"; // Import the User model
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
    try {
      await connectToDatabase();
  
      const session = await getServerSession({ req, options: NextAuthOptions });
      console.log("Session:", session);
  
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const user = await User.findOne({ email: session.user.email });
      //console.log("uuuu" + user);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const { title, description, completed } = await req.json();
  
      if (!title || !description) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      const newTask = new Task({
        id: new mongoose.Types.ObjectId(), 
        title,
        description,
        completed: completed || false,
        userId: user._id, // Reference the user ObjectId
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      await newTask.save();
  
      return NextResponse.json({ message: "Task created successfully" }, { status: 201 });
    } catch (error) {
      console.error("Error creating task:", error);
      return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
  }
  