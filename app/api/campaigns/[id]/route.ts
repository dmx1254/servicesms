import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import CampaignModel, { IContact } from "@/app/lib/models/campaign.model";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/db";

await connectDB();

// GET - Récupérer une campagne spécifique
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(options);
    if (!session?.user) {
      console.log("Erreur d'authentification: Session non trouvée");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const campaignId = await params;

    // Connexion à la base de données

    // console.log("Tentative de récupération de la campagne:", params.id);

    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(campaignId.id)) {
      console.log("ID de campagne invalide:", campaignId.id);
      return NextResponse.json(
        { error: "ID de campagne invalide" },
        { status: 400 }
      );
    }

    // Récupération de la campagne
    const campaign = await CampaignModel.findOne({
      _id: campaignId.id,
      userId: session.user.id,
    });

    console.log("Résultat de la recherche:", campaign);

    if (!campaign) {
      console.log("Campagne non trouvée pour l'ID:", campaignId.id);
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Erreur lors de la récupération de la campagne:", error);
    return NextResponse.json(
      {
        error: "Erreur lors du chargement de la campagne",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour ou dupliquer une campagne
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const campaignId = await params;

    const body = await request.json();
    const campaign = await CampaignModel.findOne({
      id: campaignId.id,
      userId: session.user.id,
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    if (body.action === "duplicate") {
      // Créer une copie de la campagne
      const duplicatedCampaign = new CampaignModel({
        ...campaign.toJSON(),
        _id: new mongoose.Types.ObjectId(),
        id: undefined,
        name: `${campaign.name} (copie)`,
        status: "draft",
        successCount: 0,
        failureCount: 0,
        contacts: campaign.contacts.map((contact: IContact) => ({
          ...contact,
          status: undefined,
          errorMessage: undefined,
        })),
      });

      await duplicatedCampaign.save();
      return NextResponse.json(duplicatedCampaign);
    } else if (body.action === "send") {
      // Mettre à jour le statut de la campagne
      campaign.status = "sent";
      await campaign.save();
      return NextResponse.json(campaign);
    } else {
      // Mise à jour normale
      Object.assign(campaign, body);
      await campaign.save();
      return NextResponse.json(campaign);
    }
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la campagne" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une campagne
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const campaignId = await params;

    const campaign = await CampaignModel.findByIdAndDelete(campaignId.id);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Campagne supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la campagne" },
      { status: 500 }
    );
  }
}
