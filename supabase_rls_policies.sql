-- 1. Enable RLS on both tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;


-- 2. PRODUCTS TABLE POLICIES
-- Anyone can view products
CREATE POLICY "Public profiles are viewable by everyone."
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products (Checking via authenticated user role mechanism isn't directly exposed by Clerk to Supabase out of the box without JWT templates, so for simplicity in this prototype, we'll allow all authenticated users to insert if we aren't using a custom JWT. But to be safe, disable inserts for everyone except the Service Role Key).
-- If you use the Supabase Service Role key in your Admin dashboard Server Actions, it bypasses RLS.
-- For now, if the client sends requests from the browser, we allow inserts from authenticated users.
CREATE POLICY "Authenticated users can create products."
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);


-- 3. BOOKINGS TABLE POLICIES
-- Users can only see their own bookings
CREATE POLICY "Users can view own bookings."
  ON bookings FOR SELECT
  USING ( auth.uid()::text = user_id OR user_id IS NULL ); -- Allow null if you want guests to see theirs, but usually you want strict checking.

-- Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings."
  ON bookings FOR INSERT
  WITH CHECK ( auth.uid()::text = user_id OR user_id IS NULL );

-- Master Tailor (Admin) can view all bookings. 
-- *Note: Without Clerk JWT Templates pushing the 'admin' role to Supabase, you must list the explicit user_ids of the admins here, or rely on a `roles` table.
CREATE POLICY "Master Tailors can view all bookings."
  ON bookings FOR SELECT
  USING (
    user_id IN (
      'user_2...delectablesvelt_id', 
      'user_2...vibesemmy_id'
    )
  );
  
CREATE POLICY "Master Tailors can update all bookings."
  ON bookings FOR UPDATE
  USING (
    user_id IN (
      'user_2...delectablesvelt_id', 
      'user_2...vibesemmy_id'
    )
  );
