import InvoiceModel from "@/app/lib/models/invoice.model"
import UserModel from "@/app/lib/models/user.model"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  try {
    console.log("Webhook received")

    // Vérification par secret partagé (Bearer token)
    const authHeader = req.headers.get("authorization")
    console.log("Authorization header:", authHeader)

    if (!authHeader) {
      console.log("No Authorization header found")
      return NextResponse.json({ error: "Unauthorized - No authorization header" }, { status: 401, headers })
    }

    // Extraire le token du format "Bearer <token>"
    let token
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    } else {
      // Au cas où le header ne suit pas exactement le format "Bearer <token>"
      token = authHeader
    }

    if (!token) {
      console.log("No token found in authorization header")
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401, headers })
    }

    // Récupérer le secret du webhook depuis les variables d'environnement
    const secret = process.env.WAVE_WEBHOOK_CHECKOUT_COMPLETED_SUCCESS
    if (!secret) {
      console.log("WAVE_WEBHOOK_CHECKOUT_COMPLETED_SUCCESS is not defined")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500, headers })
    }

    // Vérifier si le token correspond au secret
    if (token !== secret) {
      console.log("Invalid token")
      console.log("Received:", token)
      console.log("Expected:", secret)
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401, headers })
    }

    console.log("Bearer token verified successfully")

    // Analyser le corps JSON
    const data = await req.json()
    console.log("Webhook data:", JSON.stringify(data))

    // Traiter l'événement webhook
    if (data.type === "checkout.session.completed") {
      console.log("Processing checkout.session.completed event")

      try {
        const userId = data.data.client_reference.split("_")[1]
        const smsQuantity = Number(data.data.client_reference.split("_")[2])
        const completedPaymentDate = data.data.when_completed
        const id = data.id
        const paymentId = data.data.id
        const transactionId = data.data.transaction_id
        const price = Number(data.data.amount)
        const currency = data.data.currency
        const bussinessName = data.data.business_name
        const checkoutStatus = data.data.checkout_status
        const paymentStatus = data.data.payment_status
        const whenCompleted = data.data.when_completed

        await UserModel.findByIdAndUpdate(userId, {
          $inc: { smsCredits: smsQuantity },
        })

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
        })

        return NextResponse.json({ message: "Payment successful" }, { status: 200, headers })
      } catch (error) {
        console.log("Error processing checkout data:", error)
        return NextResponse.json({ error: "Error processing checkout data", details: error }, { status: 500, headers })
      }
    }

    return NextResponse.json({ message: "Invalid webhook event type", type: data.type }, { status: 400, headers })
  } catch (error) {
    console.log("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      {
        status: 500,
        headers,
      },
    )
  }
}

// Gestion des requêtes OPTIONS pour CORS
export async function OPTIONS() {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return new NextResponse(null, {
    status: 200,
    headers,
  })
}

