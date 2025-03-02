import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";

// Load environment variables
const SMS_PRO_PRIVATE_KEY = process.env.SMS_PRO_PRIVATE_KEY;
const SMS_PRO_TOKEN = process.env.SMS_PRO_TOKEN;
const API_URL = "https://api.orangesmspro.sn:8443/api";

/**
 * Generate HMAC SHA1 key for Orange SMS Pro API
 */
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
    .createHmac("sha1", SMS_PRO_PRIVATE_KEY!)
    .update(msgToEncrypt)
    .digest("hex");
}

export async function POST(request: Request) {
  const session = await getServerSession(options);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Get request body
    const body = await request.json();
    const { recipient, content, signature } = body;

    // console.log(body);

    // Validate required fields
    if (!recipient || !content) {
      return NextResponse.json(
        { error: "Recipient and content are required" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!SMS_PRO_PRIVATE_KEY || !SMS_PRO_TOKEN) {
      return NextResponse.json(
        { error: "SMS service configuration missing" },
        { status: 500 }
      );
    }

    // Prepare request parameters
    const timestamp = Math.floor(Date.now() / 1000);
    const subject = "API_SMS";

    // Generate the public key
    const key = generateKey(
      SMS_PRO_TOKEN,
      subject,
      signature,
      recipient,
      content,
      timestamp
    );

    // Prepare request parameters
    const params = {
      token: SMS_PRO_TOKEN,
      subject,
      signature,
      recipient,
      content,
      timestamp,
      key,
    };

    // Make the API request
    const response = await axios({
      method: "post",
      url: API_URL,
      data: params,
      auth: {
        username: process.env.SMS_PRO_LOGIN || "",
        password: SMS_PRO_TOKEN,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Return success response

    console.log(response.data);
    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error sending SMS:", error);

    // Handle specific API errors
    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data },
        { status: error.response.status || 500 }
      );
    }

    // Handle general errors
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
