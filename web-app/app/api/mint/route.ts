import { NextRequest, NextResponse } from "next/server";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { keypairIdentity, generateSigner, publicKey } from "@metaplex-foundation/umi";
import { updateOrderStatus } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { recipientAddress, claimId } = await req.json();

    if (!recipientAddress || !claimId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.BACKEND_KEYPAIR) {
      return NextResponse.json({ error: "Backend keypair not configured" }, { status: 500 });
    }

    const rpcUrl =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

    const umi = createUmi(rpcUrl).use(mplCore());

    const secretKeyBytes = new Uint8Array(JSON.parse(process.env.BACKEND_KEYPAIR));
    const backendKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyBytes);
    umi.use(keypairIdentity(backendKeypair));

    const origin = req.nextUrl.origin;
    const metadataUri = `${origin}/api/metadata/${claimId}`;

    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      name: "Dreamprint",
      uri: metadataUri,
      owner: publicKey(recipientAddress),
    }).sendAndConfirm(umi);

    const assetAddress = asset.publicKey.toString();

    await updateOrderStatus(claimId, {
      minted_status: true,
      wallet_address: recipientAddress,
    });

    return NextResponse.json({ assetAddress });
  } catch (err) {
    console.error("Mint failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Mint failed" },
      { status: 500 }
    );
  }
}
