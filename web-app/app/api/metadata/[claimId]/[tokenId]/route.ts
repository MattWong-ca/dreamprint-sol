import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    req: Request,
    { params }: { params: Promise<{ claimId: string; tokenId: string }> }
) {
  try {
    const { claimId, tokenId } = await params;

    if (!claimId || !tokenId) {
      return NextResponse.json(
        { error: 'Missing claimId or tokenId' },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from('dreamprint_orders')
      .select('*')
      .eq('claim_id', claimId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: `Dreamprint #${tokenId}`,
      description: `NFT collectibles by Dreamprint, powered by Base.`,
      image: order.image_url,
      external_url: `https://dreamprint-sol.vercel.app/claim/${claimId}`
    });

  } catch (error: unknown) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
