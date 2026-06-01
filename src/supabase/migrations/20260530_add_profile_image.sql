-- Add image_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS image_url text;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public SELECT on avatars
CREATE POLICY "Public SELECT avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Allow authenticated users to INSERT their own avatars
CREATE POLICY "Authenticated INSERT avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (
      SELECT client_id::text FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow authenticated users to UPDATE their own avatars
CREATE POLICY "Authenticated UPDATE avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (
      SELECT client_id::text FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow authenticated users to DELETE their own avatars
CREATE POLICY "Authenticated DELETE avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (
      SELECT client_id::text FROM profiles WHERE id = auth.uid()
    )
  );
