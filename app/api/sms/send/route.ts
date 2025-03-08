import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";
import SMSModel from "@/app/lib/models/sms.model";

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

    const { recipient, message, campaignId, campaignName, signature, timest } =
      await req.json();
    // const data = await request.json();

    console.log("Données reçues:", {
      recipient,
      message,
      campaignId,
      campaignName,
      signature,
      timest,
    });

    if (!recipient || !message || !campaignId || !campaignName) {
      return NextResponse.json(
        { error: "Informations manquantes" },
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

    const sms = await SMSModel.create({
      userId: session.user.id,
      campaignId,
      campaignName,
      recipient,
      message,
      messageId: response.data.messageId || crypto.randomUUID(),
      status: "sent",
      sentAt: new Date(),
      cost: response.data.cost || 0,
      response: JSON.stringify(response.data),
    });

    return NextResponse.json({
      success: true,
      data: sms,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);
      console.log("Response headers:", error.response?.headers);
    }
    console.log(error);

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
