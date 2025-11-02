// /api/webhooks/mercadopago/confirm-payment
import { prisma } from "@/lib/prisma"
import { mercadopago } from "@/lib/mercado-preference"
import { Payment } from "mercadopago"
import { NextResponse } from "next/server"
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links"

type TypePayment = "basicSubscriptionPlan"

export async function POST(req: Request) {
  try {
    console.log("[WEBHOOK][INIT] MercadoPago payment confirmation received")

    const body = await req.json()
    console.log("[WEBHOOK][BODY]:", body)

    const { id } = body.data
    if (!id) {
      console.warn("[WEBHOOK][ERROR]: Missing payment id")
      return new NextResponse("Id is required", { status: 400 })
    }

    const payment = await new Payment(mercadopago).get({ id })
    console.log("[WEBHOOK][PAYMENT]:", payment)

    if (!payment) {
      console.warn("[WEBHOOK][ERROR]: Payment not found")
      return new NextResponse("Payment not found", { status: 404 })
    }

    if (payment.status !== "approved") {
      console.log("[WEBHOOK]: Payment not approved, skipping")
      return new NextResponse(null, { status: 200 })
    }

    const {
      id: basicSubscriptionPlanId,
      user_id: userId,
      type,
    } = payment.metadata

    const typePayment = type as TypePayment

    if (!userId) {
      console.error("[WEBHOOK][ERROR]: Missing userId in metadata")
      return new NextResponse("userId is required", { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.error("[WEBHOOK][ERROR]: User not found:", userId)
      return new NextResponse("User not found", { status: 404 })
    }

    console.log("[WEBHOOK]: User found, proceeding:", user.email)

    // ✅ Handle the subscription
    if (typePayment === "basicSubscriptionPlan") {
      const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: basicSubscriptionPlanId }
      })

      if (!subscriptionPlan) {
        console.error("[WEBHOOK][ERROR]: Subscription plan missing:", basicSubscriptionPlanId)
        return new NextResponse("Subscription plan not found", { status: 404 })
      }

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 3)

      const newUserSubscription = await prisma.userSubscription.create({
        data: {
          userId,
          planId: subscriptionPlan.id,
          expiresAt,
        }
      })

      console.log("[WEBHOOK]: Subscription created:", newUserSubscription.id)

      // ✅ 1. Generate magic link token
      const rawToken = generateMagicLinkToken()
      const hashedToken = hashMagicLinkToken(rawToken)

      const tokenRecord = await prisma.magicLinkToken.create({
        data: {
          userId,
          tokenHash: hashedToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
        }
      })

      console.log("[WEBHOOK]: Magic link token stored:", tokenRecord.id)

      // ✅ 2. Build the magic link URL
      const magicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic?token=${rawToken}`

      console.log("[WEBHOOK]: Magic link generated:", magicUrl)

      // ✅ 3. Send email
      try {
        await sendMagicLinkEmail(user.email!, magicUrl)
        console.log("[WEBHOOK]: Magic link email sent to:", user.email)
      } catch (err) {
        console.error("[WEBHOOK][EMAIL_ERROR]:", err)
      }

      return new NextResponse(null, { status: 200 })
    }

    return new NextResponse("Invalid type", { status: 400 })

  } catch (error) {
    console.error("[MERCADOPAGO][CONFIRM_PAYMENT][ERROR]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
