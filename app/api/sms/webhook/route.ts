import { NextResponse } from "next/server";
import SMSModel from "@/app/lib/models/sms.model";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { messageId, status, deliveredAt } = data;

    if (!messageId || !status) {
      return NextResponse.json(
        { error: "Informations manquantes" },
        { status: 400 }
      );
    }

    const sms = await SMSModel.findOneAndUpdate(
      { messageId },
      {
        $set: {
          status,
          deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
          response: JSON.stringify(data),
        },
      },
      { new: true }
    );

    if (!sms) {
      return NextResponse.json(
        { error: "SMS non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sms,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
} 