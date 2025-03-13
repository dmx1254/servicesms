import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import APITokenModel from "@/app/lib/models/apiToken.model";
import { connectDB } from "@/app/lib/db";
import crypto from "crypto";
import { nanoid } from "nanoid";

await connectDB();

// GET - Get user's API tokens
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const tokens = await APITokenModel.find({ userId: session.user.id });
    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Error fetching API tokens:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tokens" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: "Le nom du token est requis" },
        { status: 400 }
      );
    }

    // Générer un token avant la création
    const rawToken = `sms_${nanoid(32)}`;
    const splicesPerPart = rawToken.slice(0, 5)  + rawToken.slice(-5);

    // Créer l'entrée avec token explicite
    const token = await APITokenModel.create({
      userId: session.user.id,
      name,
      token: splicesPerPart, // Le token reduit
      hashedToken: crypto.createHash("sha256").update(rawToken).digest("hex"), // Le haché
    });

    return NextResponse.json(
      {
        ...token.toJSON(),
        token: rawToken, // Retourner le token brut une seule fois
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating API token:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du token" },
      { status: 500 }
    );
  }
}

// DELETE - Delete API token
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("id");

    if (!tokenId) {
      return NextResponse.json(
        { error: "ID du token manquant" },
        { status: 400 }
      );
    }

    const token = await APITokenModel.findOneAndDelete({
      _id: tokenId,
      userId: session.user.id,
    });

    if (!token) {
      return NextResponse.json({ error: "Token non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Token supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting API token:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du token" },
      { status: 500 }
    );
  }
}
