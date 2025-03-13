import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import SMSModel from "@/app/lib/models/sms.model";
import UserModel from "@/app/lib/models/user.model";
import { checkAmountOfSms } from "@/app/lib/utils/utils";
import { connectDB } from "@/app/lib/db";

await connectDB();
const SMS_PRO_PRIVATE_KEY = process.env.SMS_PRO_PRIVATE_KEY || "";
const SMS_PRO_TOKEN = process.env.SMS_PRO_TOKEN || "";
const API_URL = "https://api.orangesmspro.sn:8443/api";

interface SMSResponse {
  messageId: string;
  cost: number;
  status: string;
}

function generateKey(
  token: string,
  subject: string,
  signature: string,
  recipient: string,
  content: string,
  timestamp: number
): string {
  const msgToEncrypt = `${token}${subject}${signature}${recipient}${content}${timestamp}`;
  return crypto
    .createHmac("sha1", SMS_PRO_PRIVATE_KEY)
    .update(msgToEncrypt)
    .digest("hex");
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check is the company name is pending
    const isCompanyNameApproved = await UserModel.findById(session?.user?.id);
    if (isCompanyNameApproved?.companyNameStatus === "pending") {
      return NextResponse.json(
        { error: "Nom de société en attente de validation" },
        { status: 401 }
      );
    }

    // Check is the company name is rejected
    const isCompanyNameRejected = await UserModel.findById(session?.user?.id);
    if (isCompanyNameRejected?.companyNameStatus === "rejected") {
      return NextResponse.json(
        { error: "Nom de société rejeté" },
        { status: 401 }
      );
    }

    const { recipient, message, campaignId, campaignName, signature, timest } =
      await req.json();

    // console.log("Données reçues:", {
    //   recipient,
    //   message,
    //   campaignId,
    //   campaignName,
    //   signature,
    //   timest,
    // });

    if (!recipient || !message || !campaignId || !campaignName) {
      return NextResponse.json(
        { error: "Informations manquantes" },
        { status: 400 }
      );
    }

    // Vérifier le coût du SMS
    const smsCost = await checkAmountOfSms(recipient);

    // Récupérer l'utilisateur et vérifier ses crédits
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a assez de crédits
    if (user.smsCredits < smsCost) {
      return NextResponse.json(
        { error: "Crédits SMS insuffisants" },
        { status: 400 }
      );
    }

    const timestamp = timest ? timest : Math.floor(Date.now() / 1000);
    const subject = "API_SMS";
    const key = generateKey(
      SMS_PRO_TOKEN,
      subject,
      signature,
      recipient,
      message,
      timestamp
    );

    const response = await axios.post<SMSResponse>(
      API_URL,
      {
        token: SMS_PRO_TOKEN,
        subject,
        signature,
        recipient,
        content: message,
        timestamp,
        key,
      },
      {
        auth: {
          username: process.env.SMS_PRO_LOGIN || "",
          password: SMS_PRO_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // console.log(response);
    // console.log(response.data);
    // console.log(message);

    // Mettre à jour les crédits de l'utilisateur
    user.smsCredits -= smsCost;
    await user.save();

    const sms = await SMSModel.create({
      userId: session.user.id,
      campaignId,
      campaignName,
      recipient,
      message,
      messageId: response.data.messageId || crypto.randomUUID(),
      status: "sent",
      sentAt: new Date(),
      cost: smsCost,
      response: JSON.stringify(response.data),
    });

    // console.log(sms);
    // console.log(user.smsCredits);
    // console.log(response.data);

    return NextResponse.json({
      success: true,
      data: sms,
      remainingCredits: user.smsCredits,
    });
  } catch (error) {
    console.log(error);
    // if (error instanceof AxiosError) {
    //   console.log("Response data:", error.response?.data);
    //   console.log("Response status:", error.response?.status);
    //   console.log("Response headers:", error.response?.headers);
    // }
    // console.log(error);

    // if (error instanceof AxiosError && error.response?.data) {
    //   return NextResponse.json(
    //     { error: error.response.data },
    //     { status: error.response.status || 500 }
    //   );
    // }

    return NextResponse.json(
      { error: "Erreur lors de l'envoi du SMS" },
      { status: 500 }
    );
  }
}
