import InvoiceModel from "@/app/lib/models/invoice.model";
import UserModel from "@/app/lib/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader && !authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.WAVE_WEBHOOK_CHECKOUT_COMPLETED_SUCCESS;

    if (token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (data.type === "checkout.session.completed") {
    //   console.log(data.data);
      const userId = data.data.client_reference.split("_")[1];
      const smsQuantity = Number(data.data.client_reference.split("_")[2]);
      const completedPaymentDate = data.data.when_completed;
      const id = data.id;
      const paymentId = data.data.id;
      const transactionId = data.data.transaction_id;
      const price = Number(data.data.amount);
      const currency = data.data.currency;
      const bussinessName = data.data.business_name;
      const checkoutStatus = data.data.checkout_status;
      const paymentStatus = data.data.payment_status;
      const whenCompleted = data.data.when_completed;

      await UserModel.findByIdAndUpdate(userId, {
        $inc: { smsCredits: smsQuantity },
      });

      await InvoiceModel.create({
        userId,
        smsQuantity,
        completedPaymentDate,
        id,
        paymentId,
        transactionId,
        price,
        currency,
        bussinessName,
        checkoutStatus,
        paymentStatus,
        whenCompleted,
      });

      return NextResponse.json(
        { message: "Payment successful" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}

// Gestion des requêtes OPTIONS pour CORS
export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
