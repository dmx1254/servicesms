import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import UserModel from "@/app/lib/models/user.model";
import { connectDB } from "@/app/lib/db";
import bcrypt from "bcrypt";

await connectDB();

// GET - Get user profile
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await UserModel.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { currentPassword, newPassword, ...updateData } = data;

    // Get current user data
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Handle company name change
    if (updateData.companyName && updateData.companyName !== user.companyName) {
      // Check if there's already a pending change
      if (user.companyNameStatus === "pending") {
        return NextResponse.json(
          { error: "Une demande de changement de nom est déjà en attente" },
          { status: 400 }
        );
      }

      // Check if enough time has passed since last change (30 days)
      if (user.lastCompanyNameChange) {
        const daysSinceLastChange = Math.floor(
          (Date.now() - user.lastCompanyNameChange.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastChange < 30) {
          return NextResponse.json(
            { 
              error: "Vous devez attendre 30 jours entre chaque changement de nom",
              daysRemaining: 30 - daysSinceLastChange
            },
            { status: 400 }
          );
        }
      }

      // Store the requested company name as pending
      updateData.pendingCompanyName = updateData.companyName;
      updateData.companyNameStatus = "pending";
      delete updateData.companyName; // Keep the current company name until approved
    }

    // If updating password, verify current password
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect" },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Check if email is being updated and is not already taken
    if (updateData.email && updateData.email !== session.user.email) {
      const existingUser = await UserModel.findOne({ email: updateData.email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà utilisée" },
          { status: 400 }
        );
      }
    }

    // Check if phone is being updated and is not already taken
    if (updateData.phone && updateData.phone !== session.user.phone) {
      const existingUser = await UserModel.findOne({ phone: updateData.phone });
      if (existingUser) {
        return NextResponse.json(
          { error: "Ce numéro de téléphone est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
} 