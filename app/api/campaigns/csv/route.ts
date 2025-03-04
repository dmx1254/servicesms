import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";

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
    const fileContent = fileBuffer.toString();

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as any[];

    // console.log("Exemple de records parsés:", records.slice(0, 2));

    // Validation des champs requis
    if (!records) {
      return NextResponse.json({ error: "Erreur lors de la conversion" });
    }
    console.log(records);
    // Créer les contacts avec le groupe spécifié
    // const contacts = records.map((record) => ({
    //   userId: session.user.id,
    //   prenom: record.prenom.trim(),
    //   nom: record.nom.trim(),
    //   telephone: record.telephone.trim(),
    //   groupName: groupName.trim(),
    // }));

    // const contacts = records.map((record) => {
    //   record;
    // });

    // console.log("Contacts préparés pour l'import:", contacts.slice(0, 2));

    return NextResponse.json({
      message: "Contacts importés avec succès",
      res: records,
      count: records.length,
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
