// /app/[shortId]/route.ts
import { connectDB } from "@/app/lib/db";
import UrlModel from "@/app/lib/models/url";
import {NextResponse } from "next/server";
await connectDB();

export async function GET(
  req: Request,
  { params }: { params: { shortId: string } }
) {
  try {
    const urlShort = await params;

    const shortId = urlShort.shortId
    
    
    const url = await UrlModel.findOne({ shortId });
    
    if (!url) {
      // Redirect to 404 page or home
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Increment click count
    url.clicks += 1;
    await url.save();
    
    // Redirect to the original URL
    return NextResponse.redirect(new URL(url.originalUrl));
  } catch (error) {
    console.error("Error during redirect:", error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}