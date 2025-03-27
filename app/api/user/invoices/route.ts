import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";

import { connectDB } from "@/app/lib/db";
import InvoiceModel from "@/app/lib/models/invoice.model";

await connectDB();

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const invoices = await InvoiceModel.find({
      userId: session.user.id,
    }).populate("userId");
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong or maybe server error", details: error },
      { status: 500 }
    );
  }
}
