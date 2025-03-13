import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/option";
import APITokenModel from "@/app/lib/models/apiToken.model";
import { connectDB } from "@/app/lib/db";

await connectDB();

// PATCH - Update token status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { isActive } = await request.json();
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Le statut du token est requis" },
        { status: 400 }
      );
    }

    const token = await APITokenModel.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.id,
      },
      { isActive },
      { new: true }
    );

    if (!token) {
      return NextResponse.json(
        { error: "Token non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(token);
  } catch (error) {
    console.error("Error updating token status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du token" },
      { status: 500 }
    );
  }
} 