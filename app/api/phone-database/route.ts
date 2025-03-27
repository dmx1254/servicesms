import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/option";
import PhoneDatabase from "@/app/lib/models/phoneDatabase.model";
import UserBDLocationModel from "@/app/lib/models/bd-location";
import { connectDB } from "@/app/lib/db";

await connectDB();

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer toutes les bases de données disponibles
    // const databases = await PhoneDatabase.find({ isAvailable: true })
    //   .select("name category qualityScore phones")
    //   .sort({ createdAt: -1 })
    //   .lean();

    // console.log(databases);

    // const filteredDatabases = databases.map((db) => ({
    //   name: db.name,
    //   category: db.category,
    //   qualityScore: db.qualityScore,
    //   totalNumbers: db.phones.length,
    // }));

    const databases = await PhoneDatabase.aggregate([
      { $match: { isAvailable: true } },
      {
        $project: {
          name: 1,
          category: 1,
          qualityScore: 1,
          totalNumbers: { $size: "$phones" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const limitData = await UserBDLocationModel.find({})
      .select("numberLimit")
      .lean();

    const limitNumber = (limitData[0] && limitData[0].numberLimit) ?? 1000;

    // console.log(limitNumber);

    // console.log(databases);

    // Récupérer les locations actives de l'utilisateur
    const userLocations = await UserBDLocationModel.find({
      userId: session.user.id,
      isActive: true,
    })
      .populate("userDblocation")
      .sort({ createdAt: -1 })
      .lean();

    // console.log(userLocations);

    const newUserLocations = userLocations.map((location) => ({
      ...location,
      userDblocation: {
        ...location.userDblocation,
        phones:
          location.userDblocation && location.userDblocation.phones
            ? location.userDblocation.phones.slice(0, limitNumber)
            : [],
      },
    }));

    // console.log(newUserLocations);

    return NextResponse.json({
      success: true,
      databases,
      userLocations: newUserLocations,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des bases de données:",
      error
    );
    return NextResponse.json(
      { error: "Impossible de récupérer les bases de données" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { databaseId, duration, numberLimit } = body;

    const isLocationExist = await UserBDLocationModel.findOne({
      userId: session.user.id,
      userDblocation: databaseId,
      isActive: true,
    });

    if (isLocationExist) {
      return NextResponse.json(
        { error: "Vous avez déjà loué cette base de données" },
        { status: 400 }
      );
    }

    const numberLimitNumber = Number(numberLimit);

    if (numberLimitNumber < 1000) {
      return NextResponse.json(
        { error: "Minimum 1000 numéros" },
        { status: 400 }
      );
    }
    // Vérifier si la base de données existe et est disponible
    const database = await PhoneDatabase.findById(databaseId);
    if (!database || !database.isAvailable) {
      return NextResponse.json(
        { error: "Base de données non disponible" },
        { status: 400 }
      );
    }

    const durationNumber = Number(duration);

    // Calculer la date d'expiration
    const expiresAt = new Date(
      Date.now() + durationNumber * 24 * 60 * 60 * 1000
    );

    // Créer la location
    const location = await UserBDLocationModel.create({
      userId: session.user.id,
      userDblocation: databaseId,
      duration: durationNumber,
      expiresAt,
      numberLimit: numberLimitNumber,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Base de données louée avec succès",
      location,
    });
  } catch (error) {
    console.error("Erreur lors de la location de la base de données:", error);
    return NextResponse.json(
      { error: "Impossible de louer la base de données" },
      { status: 500 }
    );
  }
}
