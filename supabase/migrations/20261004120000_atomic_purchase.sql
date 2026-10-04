-- A purchase touches a wallet, an order, escrow, a transaction record and a
-- listing. Keeping it in one PostgreSQL function makes all of those changes
-- atomic: any validation or insert failure rolls the entire purchase back.
CREATE OR REPLACE FUNCTION public.complete_purchase(
  p_listing_id uuid,
  p_buyer_id uuid,
  p_affiliate_link_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing public.listings%ROWTYPE;
  v_buyer_wallet public.wallets%ROWTYPE;
  v_affiliate_link public.affiliate_links%ROWTYPE;
  v_affiliate_link_id uuid := NULL;
  v_order_id uuid;
BEGIN
  -- Lock the listing before checking its status. A second simultaneous buyer
  -- waits here and then sees "not available" once the first purchase commits.
  SELECT * INTO v_listing
  FROM public.listings
  WHERE id = p_listing_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF v_listing.status <> 'active' THEN
    RAISE EXCEPTION 'Listing is not available for purchase';
  END IF;

  IF v_listing.user_id = p_buyer_id THEN
    RAISE EXCEPTION 'You cannot purchase your own listing';
  END IF;

  -- Lock the wallet as well, preventing two purchases from spending the same
  -- balance between an availability check and a debit.
  SELECT * INTO v_buyer_wallet
  FROM public.wallets
  WHERE user_id = p_buyer_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_buyer_wallet.balance < v_listing.price_ecocoins THEN
    RAISE EXCEPTION 'Insufficient EcoCoins balance';
  END IF;

  IF p_affiliate_link_code IS NOT NULL THEN
    SELECT * INTO v_affiliate_link
    FROM public.affiliate_links
    WHERE link_code = p_affiliate_link_code
      AND listing_id = p_listing_id;

    IF FOUND AND v_affiliate_link.affiliate_user_id <> p_buyer_id THEN
      v_affiliate_link_id := v_affiliate_link.id;
    END IF;
  END IF;

  UPDATE public.wallets
  SET balance = balance - v_listing.price_ecocoins
  WHERE user_id = p_buyer_id;

  INSERT INTO public.orders (
    buyer_id,
    seller_id,
    listing_id,
    amount_ecocoins,
    status,
    affiliate_link_id
  )
  VALUES (
    p_buyer_id,
    v_listing.user_id,
    p_listing_id,
    v_listing.price_ecocoins,
    'pending',
    v_affiliate_link_id
  )
  RETURNING id INTO v_order_id;

  INSERT INTO public.escrow (order_id, amount, status)
  VALUES (v_order_id, v_listing.price_ecocoins, 'held');

  INSERT INTO public.transactions (user_id, order_id, amount, transaction_type, description)
  VALUES (
    p_buyer_id,
    v_order_id,
    -v_listing.price_ecocoins,
    'purchase',
    'Purchased: ' || v_listing.title
  );

  IF v_affiliate_link_id IS NOT NULL THEN
    INSERT INTO public.affiliate_clicks (affiliate_link_id, ip_address)
    VALUES (v_affiliate_link_id, NULL);
  END IF;

  UPDATE public.listings
  SET status = 'sold'
  WHERE id = p_listing_id;

  RETURN jsonb_build_object(
    'orderId', v_order_id,
    'newBalance', v_buyer_wallet.balance - v_listing.price_ecocoins,
    'message', 'Purchase completed successfully'
  );
END;
$$;

-- Only the Edge Function's service-role client may execute this function.
REVOKE ALL ON FUNCTION public.complete_purchase(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_purchase(uuid, uuid, text) TO service_role;
