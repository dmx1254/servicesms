import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
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

    console.log("Groupe pour l'import:", groupName);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileContent = fileBuffer.toString();

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ContactRecord[];

    console.log("Exemple de records parsés:", records.slice(0, 2));

    // Validation des champs requis
    for (const record of records) {
      if (!record.prenom?.trim()) {
        return NextResponse.json(
          { error: 'Le champ "prenom" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
      if (!record.nom?.trim()) {
        return NextResponse.json(
          { error: 'Le champ "nom" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
      if (!record.telephone?.trim()) {
        return NextResponse.json(
          { error: 'Le champ "telephone" est requis pour tous les contacts' },
          { status: 400 }
        );
      }
    }

    // Créer les contacts avec le groupe spécifié
    const contacts = records.map((record) => ({
      userId: session.user.id,
      prenom: record.prenom.trim(),
      nom: record.nom.trim(),
      telephone: record.telephone.trim(),
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
    console.error("Erreur lors de l'import CSV:", error);
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
