-- Add user_id to documents for per-user document management
ALTER TABLE documents ADD COLUMN user_id UUID REFERENCES profiles(id);

-- Backfill existing rows: assign to the first active admin of the same client
UPDATE documents
SET user_id = (
  SELECT id FROM profiles
  WHERE profiles.client_id = documents.client_id
    AND profiles.is_active = true
  ORDER BY profiles.created_at ASC
  LIMIT 1
);

-- Make it NOT NULL after backfill
ALTER TABLE documents ALTER COLUMN user_id SET NOT NULL;
