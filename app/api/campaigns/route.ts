import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/option";
import CampaignModel from "@/app/lib/models/campaign.model";
import { connectDB } from "@/app/lib/db";

// Connect to database
connectDB();

// GET - Récupérer toutes les campagnes
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const campaigns = await CampaignModel.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des campagnes" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle campagne
export async function POST(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    const data  = {
      ...body,
      userId: session.user.id,
      recipientCount: body.contacts?.length || 0,
    }
    console.log(body);
    const campaign = CampaignModel.create(data);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la campagne" },
      { status: 500 }
    );
  }
}

// Supprimer une campagne
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de campagne manquant" },
        { status: 400 }
      );
    }

    await CampaignModel.deleteOne({ id, userId: session.user.id });

    return NextResponse.json({
      success: true,
      message: "Campagne supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la campagne:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la campagne" },
      { status: 500 }
    );
  }
}
