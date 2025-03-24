import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import Contact from "@/app/lib/models/Contact";
import { connectDB } from "@/app/lib/db";

await connectDB();
export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // console.log("Recherche des groupes pour l'utilisateur:", session.user.id);

    // Récupérer les noms de groupes uniques (non vides)
    const distinctGroups = await Contact.distinct("groupName", {
      userId: session.user.id,
      groupName: { $exists: true, $ne: "" },
    });

    // console.log("Groupes distincts trouvés:", distinctGroups);

    // Compter les contacts pour chaque groupe
    const groups = await Promise.all(
      distinctGroups.map(async (groupName) => {
        const count = await Contact.countDocuments({
          userId: session.user.id,
          groupName,
        });
        return { name: groupName, count };
      })
    );

    // Trier les groupes par nom
    groups.sort((a, b) => a.name.localeCompare(b.name));

    // Ajouter le groupe "Tous les contacts"
    const totalContacts = await Contact.countDocuments({
      userId: session.user.id,
    });

    const allGroups = [
      {
        name: "Tous les contacts",
        count: totalContacts,
      },
      ...groups,
    ];

    // console.log("Liste finale des groupes:", allGroups);

    return NextResponse.json(allGroups);
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    return NextResponse.json(
      { error: "Impossible de récupérer les groupes : " + errorMessage },
      { status: 500 }
    );
  }
}
