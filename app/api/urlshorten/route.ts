// /app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import UrlModel from "@/app/lib/models/url";
import { nanoid } from "nanoid";

await connectDB();
export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { originalUrl } = body;
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: "Original URL is required" },
        { status: 400 }
      );
    }
    
    // Validate URL
    try {
      new URL(originalUrl);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existingUrl = await UrlModel.findOne({ originalUrl });
    if (existingUrl) {
      return NextResponse.json({ url: existingUrl }, { status: 200 });
    }

    // Create a new short URL
    const shortId = nanoid(8);
    const newUrl = await UrlModel.create({
      originalUrl,
      shortId,
    });

    return NextResponse.json({ url: newUrl }, { status: 201 });
  } catch (error: any) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}