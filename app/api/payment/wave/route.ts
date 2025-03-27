import { WavePayment } from "@/app/lib/utils/utils";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const data: WavePayment = await req.json();
    // const { userId, smsQuantity, totalPrice, paymentMethod, phoneNumber } =
    //   data;

    // const phone =
    //   data.phoneNumber && data.phoneNumber.startsWith("+")
    //     ? data.phoneNumber
    //     : `+${data.phoneNumber}`;
    // const newData = {
    //   ...data,
    //   phoneNumber: phone,
    // };

    const ref = `SMS_${data.userId}_${data.smsQuantity}_${Date.now()}`;

    // console.log(data.totalPrice);

    const price = String(data.totalPrice);

    const checkout_params = {
      amount: price,
      currency: "XOF",
      error_url: "https://axiomtext.com/dashboard",
      success_url: "https://axiomtext.com/dashboard",
      client_reference: ref,
    };

    const response = await axios.post(
      `${process.env.WAVE_BASE_URL}/checkout/sessions`,
      checkout_params,
      {
        headers: {
          Authorization: `Bearer ${process.env.WAVE_API_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(error);
  }
}
