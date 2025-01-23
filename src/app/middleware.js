import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import NextAuthOptions from "@/lib/auth";

export async function middleware(req) {
    // Debugging: Log the incoming request URL to see if it's being matched
    console.log('Middleware triggered for:', req.url);

    // Get the session
    const session = await getServerSession(req, NextAuthOptions);

    // Debugging: Log the session object
    console.log('Session:', session);

    // Check if session is null or user doesn't exist
    if (!session || !session.user) {
        console.log('No session or user found, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login
    }

    // Destructure the role from session
    const { role } = session.user;
    console.log('User Role:', role);

    // If role is not Admin, redirect to 404 page
    if (role !== 'Admin') {
        console.log('User is not Admin, redirecting to /404');
        return NextResponse.redirect(new URL('/404', req.url)); // Redirect to 404 page
    }

    // If role is Admin, allow access
    console.log('User is Admin, allowing access');
    return NextResponse.next(); // Proceed to the requested page
}

export const config = {
    matcher: ['/admin/:path*'], // Match routes under /admin/*
};
