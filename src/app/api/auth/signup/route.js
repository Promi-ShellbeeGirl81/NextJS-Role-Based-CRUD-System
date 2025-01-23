import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req) {
  await connectToDatabase();
  const { name, email, password, confirmPassword } = await req.json();
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: "Missing required fields" });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email address" },
      { status: 400 }
    );
  }
  if (confirmPassword !== password) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      id: new mongoose.Types.ObjectId(), 
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
