import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      return NextResponse.json(
        { error: "Missing signature or secret" },
        { status: 400 },
      );
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const subscription: Stripe.Response<Stripe.Subscription> =
        await stripe.subscriptions.retrieve(session.subscription as string);

      if (!session.metadata?.userId) {
        return NextResponse.json(
          { error: "No userId in session metadata" },
          { status: 400 },
        );
      }

      await (prisma as any).subscription.upsert({
        where: { userId: session.metadata.userId },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCustomerId: subscription.customer as string,
          planType: "PRO", // Simplified for now
          status: subscription.status,
          currentPeriodEnd: new Date(
            (subscription as any).current_period_end * 1000,
          ),
        },
        create: {
          userId: session.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCustomerId: subscription.customer as string,
          planType: "PRO",
          status: subscription.status,
          currentPeriodEnd: new Date(
            (subscription as any).current_period_end * 1000,
          ),
        },
      });
      break;

    case "customer.subscription.deleted":
    case "customer.subscription.updated":
      const updatedSub = event.data.object as any;
      await (prisma as any).subscription.update({
        where: { stripeSubscriptionId: updatedSub.id },
        data: {
          status: updatedSub.status,
          currentPeriodEnd: new Date(updatedSub.current_period_end * 1000),
          cancelAtPeriodEnd: updatedSub.cancel_at_period_end,
        },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
