import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Contact from "@/app/lib/models/Contact";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import { connectDB } from "@/app/lib/db";

await connectDB();

interface ContactRecord {
  prenom: string;
  nom: string;
  telephone: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const groupName = formData.get("groupName") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    if (!groupName?.trim()) {
      return NextResponse.json(
        { error: "Le nom du groupe est requis" },
        { status: 400 }
      );
    }

    console.log("Groupe pour l'import Excel:", groupName);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(worksheet) as ContactRecord[];

    console.log("Exemple de records Excel parsés:", records.slice(0, 2));

    // Validation et nettoyage des données
    for (const record of records) {
      if (!record.prenom?.toString().trim()) {
        return NextResponse.json(
          { error: 'Le champ "prenom" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
      if (!record.nom?.toString().trim()) {
        return NextResponse.json(
          { error: 'Le champ "nom" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
      if (!record.telephone?.toString().trim()) {
        return NextResponse.json(
          { error: 'Le champ "telephone" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
    }

    // Créer les contacts avec le groupe spécifié
    const contacts = records.map((record) => ({
      userId: session.user.id,
      prenom: record.prenom.toString().trim(),
      nom: record.nom.toString().trim(),
      telephone: record.telephone.toString().trim(),
      groupName: groupName.trim(),
    }));

    console.log("Contacts préparés pour l'import:", contacts.slice(0, 2));

    const result = await Contact.insertMany(contacts);
    console.log(
      `${result.length} contacts importés avec succès dans le groupe "${groupName}"`
    );

    return NextResponse.json({
      message: "Contacts importés avec succès",
      count: result.length,
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
