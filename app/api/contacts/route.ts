import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]/option';
import Contact from '@/app/lib/models/Contact';
import { connectDB } from '@/app/lib/db';

await connectDB();

interface QueryParams {
  userId: string;
  $or?: Array<{
    [key: string]: {
      $regex: string;
      $options: string;
    };
  }>;
  groupName?: string;
}

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const group = searchParams.get('group') || '';

    const query: QueryParams = { userId: session.user.id };

    if (search) {
      query.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { nom: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } },
      ];
    }

    if (group && group !== 'Tous les contacts') {
      query.groupName = group;
    }

    const totalContacts = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalContacts / ITEMS_PER_PAGE);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    return NextResponse.json({
      contacts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    return NextResponse.json(
      { error: 'Impossible de récupérer les contacts : ' + errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { prenom, nom, telephone, groupName } = body;

    // Validation des champs requis
    if (!prenom?.trim() || !nom?.trim() || !telephone?.trim() || !groupName?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Création du contact
    const contact = await Contact.create({
      userId: session.user.id,
      prenom: prenom.trim(),
      nom: nom.trim(),
      telephone: telephone.trim(),
      groupName: groupName.trim(),
    });

    // console.log('Contact créé:', contact);

    return NextResponse.json({
      message: 'Contact créé avec succès',
      contact,
    });
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    return NextResponse.json(
      { error: 'Impossible de créer le contact : ' + errorMessage },
      { status: 500 }
    );
  }
} 