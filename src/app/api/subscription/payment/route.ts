import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

interface MidtransTransactionResponse {
  token: string;
  redirect_url: string;
}

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, price, email } = body;

    const parameter = {
      transaction_details: {
        order_id:
          `OVERTUREAI-${plan.toUpperCase()}-` +
          Math.floor(1000000 + Math.random() * 9000000),
        gross_amount: price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: email,
      },
      item_details: [
        {
          price: price,
          quantity: 1,
          name: `OvertureAI ${plan} 1 Month`,
        },
      ],
    };

    const response: MidtransTransactionResponse =
      await snap.createTransaction(parameter);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[PAYMENT_SUBSCRIPTION_ROUTE]", error);
  }
}
