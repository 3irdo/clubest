/*
  # Initial Schema for Archery Club Management System
  
  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - member, admin, instructor
      - `phone` (text)
      - `membership_status` (text) - active, inactive, pending
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `trainings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `duration_minutes` (integer)
      - `instructor_id` (uuid, foreign key to users)
      - `max_participants` (integer)
      - `status` (text) - scheduled, completed, cancelled
      - `created_at` (timestamptz)
    
    - `training_registrations`
      - `id` (uuid, primary key)
      - `training_id` (uuid, foreign key to trainings)
      - `user_id` (uuid, foreign key to users)
      - `status` (text) - confirmed, pending, cancelled
      - `registered_at` (timestamptz)
    
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `amount` (decimal)
      - `concept` (text)
      - `status` (text) - pending, confirmed, rejected
      - `payment_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `size_bytes` (integer)
      - `uploaded_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `stock` (integer)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `total_amount` (decimal)
      - `status` (text) - pending, completed, cancelled
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `subtotal` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for admins to manage all data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin', 'instructor')),
  phone text,
  membership_status text DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  instructor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  max_participants integer DEFAULT 10,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid REFERENCES trainings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  registered_at timestamptz DEFAULT now(),
  UNIQUE(training_id, user_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  concept text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  size_bytes integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  stock integer DEFAULT 0,
  image_url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view trainings"
  ON trainings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage trainings"
  ON trainings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view own registrations"
  ON training_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own registrations"
  ON training_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );