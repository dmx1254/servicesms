import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import UserModel from "@/app/lib/models/user.model";
import VerificationModel from "@/app/lib/models/verification.model";
import { connectDB } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, code, newPassword } = await request.json();

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le code de réinitialisation
    const verification = await VerificationModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Code de vérification invalide ou expiré" },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    // Supprimer le code de vérification
    await VerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json(
      { message: "Mot de passe réinitialisé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password route:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
} 