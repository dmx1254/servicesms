import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactTemplate } from "@/components/template/contact-template";

const resend = new Resend(process.env.RESEND_SERVICESMS_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, subject, message } = data;

    // Validation des données
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Envoi de l'email à l'administrateur
    await resend.emails.send({
      from: "axiomtext <noreply@axiomtext.com>",
      to: process.env.ADMIN_EMAIL || "mamadousy1254@gmail.com",
      subject: `Nouveau message de contact - ${subject}`,
      react: ContactTemplate({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
      }) as React.ReactElement,
    });

    // Envoi d'un email de confirmation à l'utilisateur
    await resend.emails.send({
      from: "axiomtext <noreply@axiomtext.com>",
      to: email,
      subject: "Confirmation de réception - AxiomText",
      react: ContactTemplate({
        isConfirmation: true,
        firstName,
        lastName,
      }) as React.ReactElement,
    });

    return NextResponse.json(
      { message: "Message envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
} 