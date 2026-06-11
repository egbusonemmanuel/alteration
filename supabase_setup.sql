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
  status          text NOT NULL DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Anyone can read bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update bookings"
  ON bookings FOR UPDATE
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('garments', 'garments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read products storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'products' );

CREATE POLICY "Anyone can upload to products storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'products' );

CREATE POLICY "Public can read garments storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'garments' );

CREATE POLICY "Anyone can upload to garments storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'garments' );

CREATE POLICY "Public can read receipts storage"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'receipts' );

CREATE POLICY "Anyone can upload to receipts storage"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'receipts' );
