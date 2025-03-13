import { connectDB } from "@/app/lib/db";
import UserModel from "@/app/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDB();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await params;
    const userData = await UserModel.findById(user.id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { smsCredits: userData.smsCredits },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sms credits:", error);
    return NextResponse.json(
      { error: "Error fetching sms credits" },
      { status: 500 }
    );
  }
}
