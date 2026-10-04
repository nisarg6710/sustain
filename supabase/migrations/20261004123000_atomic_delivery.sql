-- Release held escrow only after the authenticated buyer confirms a shipped
-- order. The order, escrow, seller credit and optional affiliate commission
-- commit together or are all rolled back.
CREATE OR REPLACE FUNCTION public.complete_delivery(
  p_order_id uuid,
  p_buyer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_escrow public.escrow%ROWTYPE;
  v_seller_wallet public.wallets%ROWTYPE;
  v_affiliate_link public.affiliate_links%ROWTYPE;
  v_affiliate_wallet public.wallets%ROWTYPE;
  v_seller_amount integer;
  v_affiliate_commission integer := 0;
  v_listing_title text;
BEGIN
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.buyer_id <> p_buyer_id THEN
    RAISE EXCEPTION 'Only the buyer can confirm delivery';
  END IF;

  IF v_order.status = 'completed' THEN
    RAISE EXCEPTION 'Order already completed';
  END IF;

  IF v_order.status <> 'shipped' THEN
    RAISE EXCEPTION 'Order must be shipped before confirming delivery';
  END IF;

  SELECT * INTO v_escrow
  FROM public.escrow
  WHERE order_id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Escrow not found';
  END IF;

  IF v_escrow.status <> 'held' THEN
    RAISE EXCEPTION 'Escrow already released';
  END IF;

  SELECT * INTO v_seller_wallet
  FROM public.wallets
  WHERE user_id = v_order.seller_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seller wallet not found';
  END IF;

  SELECT title INTO v_listing_title FROM public.listings WHERE id = v_order.listing_id;
  v_seller_amount := v_order.amount_ecocoins;

  IF v_order.affiliate_link_id IS NOT NULL THEN
    SELECT * INTO v_affiliate_link
    FROM public.affiliate_links
    WHERE id = v_order.affiliate_link_id;

    IF FOUND THEN
      v_affiliate_commission := floor(v_order.amount_ecocoins * 0.1);
      v_seller_amount := v_order.amount_ecocoins - v_affiliate_commission;

      SELECT * INTO v_affiliate_wallet
      FROM public.wallets
      WHERE user_id = v_affiliate_link.affiliate_user_id
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Affiliate wallet not found';
      END IF;
    END IF;
  END IF;

  UPDATE public.wallets
  SET balance = balance + v_seller_amount
  WHERE user_id = v_order.seller_id;

  UPDATE public.escrow
  SET status = 'released', released_at = now()
  WHERE order_id = p_order_id;

  UPDATE public.orders
  SET status = 'completed', completed_at = now()
  WHERE id = p_order_id;

  INSERT INTO public.transactions (user_id, order_id, amount, transaction_type, description)
  VALUES (v_order.seller_id, p_order_id, v_seller_amount, 'sale', 'Sale: ' || coalesce(v_listing_title, 'Item'));

  IF v_affiliate_commission > 0 THEN
    UPDATE public.wallets
    SET balance = balance + v_affiliate_commission
    WHERE user_id = v_affiliate_link.affiliate_user_id;

    INSERT INTO public.affiliate_earnings (affiliate_user_id, listing_id, affiliate_link_id, ecocoins_earned)
    VALUES (v_affiliate_link.affiliate_user_id, v_order.listing_id, v_order.affiliate_link_id, v_affiliate_commission);

    INSERT INTO public.transactions (user_id, order_id, amount, transaction_type, description)
    VALUES (v_affiliate_link.affiliate_user_id, p_order_id, v_affiliate_commission, 'commission', 'Affiliate commission: ' || coalesce(v_listing_title, 'Item'));
  END IF;

  RETURN jsonb_build_object(
    'sellerAmount', v_seller_amount,
    'affiliateCommission', v_affiliate_commission,
    'message', 'Delivery confirmed and payment released'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.complete_delivery(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_delivery(uuid, uuid) TO service_role;
