CREATE TABLE IF NOT EXISTS products (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  price_ngn   integer NOT NULL DEFAULT 0,
  price_usd   integer NOT NULL DEFAULT 0,
  category    text NOT NULL DEFAULT 'Bespoke',
  tag         text,
  image_url   text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         text,
  service         text,
  measurements    jsonb,
  garment_url     text,
  receipt_url     text,
  notes           text,
  currency        text DEFAULT 'NGN',
  status          text NOT NULL DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert bookings" ON bookings;
CREATE POLICY "Anyone can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can upload receipt once" ON bookings;
CREATE POLICY "Anyone can upload receipt once"
  ON bookings FOR UPDATE
  USING (receipt_url IS NULL);

INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('garments', 'garments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read products storage" ON storage.objects;
CREATE POLICY "Public can read products storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Anyone can upload to products storage" ON storage.objects;
CREATE POLICY "Anyone can upload to products storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Public can read garments storage" ON storage.objects;
CREATE POLICY "Public can read garments storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'garments' );

DROP POLICY IF EXISTS "Anyone can upload to garments storage" ON storage.objects;
CREATE POLICY "Anyone can upload to garments storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'garments' );

DROP POLICY IF EXISTS "Public can read receipts storage" ON storage.objects;
CREATE POLICY "Public can read receipts storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'receipts' );

DROP POLICY IF EXISTS "Anyone can upload to receipts storage" ON storage.objects;
CREATE POLICY "Anyone can upload to receipts storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'receipts' );

DROP FUNCTION IF EXISTS secure_fetch_bookings(text);
CREATE OR REPLACE FUNCTION secure_fetch_bookings(pass text)
RETURNS TABLE (
  id uuid,
  user_id text,
  service text,
  measurements jsonb,
  garment_url text,
  receipt_url text,
  notes text,
  currency text,
  status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF pass = 'svelt2026' THEN
    RETURN QUERY SELECT b.id, b.user_id, b.service, b.measurements, b.garment_url, b.receipt_url, b.notes, b.currency, b.status, b.created_at FROM bookings b ORDER BY b.created_at DESC;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Invalid password';
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS secure_update_booking_status(text, uuid, text);
CREATE OR REPLACE FUNCTION secure_update_booking_status(pass text, b_id uuid, b_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF pass = 'svelt2026' THEN
    UPDATE bookings SET status = b_status WHERE id = b_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Invalid password';
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS secure_add_product(text, text, integer, integer, text, text, text);
CREATE OR REPLACE FUNCTION secure_add_product(
  pass text,
  p_name text,
  p_price_ngn integer,
  p_price_usd integer,
  p_category text,
  p_tag text,
  p_image_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF pass = 'svelt2026' THEN
    INSERT INTO products (name, price_ngn, price_usd, category, tag, image_url)
    VALUES (p_name, p_price_ngn, p_price_usd, p_category, p_tag, p_image_url);
  ELSE
    RAISE EXCEPTION 'Unauthorized: Invalid password';
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS secure_delete_product(text, uuid);
CREATE OR REPLACE FUNCTION secure_delete_product(pass text, p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF pass = 'svelt2026' THEN
    DELETE FROM products WHERE id = p_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Invalid password';
  END IF;
END;
$$;
