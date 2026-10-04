import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseRequest {
  listingId: string;
  affiliateLinkCode?: string;
}

/**
 * The browser cannot safely perform a purchase by updating several tables
 * itself. This function proves who the buyer is, then asks a database
 * transaction to debit the wallet, create the order and lock the escrow amount
 * as one all-or-nothing operation.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error('Purchase service is not configured.');
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) throw new Error('Unauthorized');

    const { listingId, affiliateLinkCode }: PurchaseRequest = await req.json();
    if (!listingId) throw new Error('Listing ID is required');

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await adminClient.rpc('complete_purchase', {
      p_listing_id: listingId,
      p_buyer_id: user.id,
      p_affiliate_link_code: affiliateLinkCode ?? null,
    });

    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase could not be completed.';
    console.error('Error processing purchase:', message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
