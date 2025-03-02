import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import SMSModel from "@/app/lib/models/sms.model";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const campaignId = searchParams.get("campaignId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: any = { userId: session.user.id };

    if (status) query.status = status;
    if (campaignId) query.campaignId = campaignId;
    if (startDate && endDate) {
      query.sentAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [sms, total] = await Promise.all([
      SMSModel.find(query)
        .sort({ sentAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      SMSModel.countDocuments(query),
    ]);

    // Calculer les statistiques
    const stats = {
      total,
      delivered: await SMSModel.countDocuments({ ...query, status: "delivered" }),
      failed: await SMSModel.countDocuments({ ...query, status: "failed" }),
      totalCost: (await SMSModel.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$cost" } } },
      ]))[0]?.total || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        sms,
        stats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
} 