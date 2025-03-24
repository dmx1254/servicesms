import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import PhoneDatabase from "@/app/lib/models/phoneDatabase.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(worksheet) as any[];

    // console.log("Exemple de records Excel parsés:", records.slice(0, 2));

    // console.log(records);

    // Validation et nettoyage des données
    // Validation des champs requis
    if (!records) {
      return NextResponse.json({ error: "Erreur lors de la conversion" });
    }

    console.log(records);

    // await PhoneDatabase.create({
    //   name: "Artisans",
    //   category: "artisans",
    //   qualityScore: 100,
    //   phones: records,
    // });

    // Créer les contacts avec le groupe spécifié
    // const contacts = records.map((record) => ({
    //   userId: session.user.id,
    //   prenom: record.prenom.toString().trim(),
    //   nom: record.nom.toString().trim(),
    //   telephone: record.telephone.toString().trim(),
    //   groupName: groupName.trim(),
    // }));

    // console.log("Contacts préparés pour l'import:", contacts.slice(0, 2));

    return NextResponse.json({
      message: "Contacts importés avec succès",
      res: records,
      count: records.length,
    });
  } catch (error) {
    console.error("Erreur lors de l'import Excel:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    return NextResponse.json(
      { error: "Erreur lors du traitement du fichier : " + errorMessage },
      { status: 500 }
    );
  }
}
