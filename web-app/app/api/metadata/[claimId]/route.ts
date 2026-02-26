import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params;

    if (!claimId) {
      return NextResponse.json({ error: "Missing claimId" }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from("dreamprint_orders")
      .select("image_url, event")
      .eq("claim_id", claimId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: "Dreamprint",
      symbol: "DPRINT",
      description: "NFT collectible by Dreamprint, powered by Solana.",
      image: order.image_url,
      external_url: `https://dreamprint-sol.vercel.app/claim/${claimId}`,
      seller_fee_basis_points: 0,
      properties: {
        category: "image",
        files: [
          {
            uri: order.image_url,
            type: "image/jpeg",
          },
        ],
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
