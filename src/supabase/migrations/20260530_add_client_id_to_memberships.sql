-- Add client_id to memberships for direct tenant isolation
ALTER TABLE memberships ADD COLUMN client_id UUID REFERENCES clients(id_client);

-- Backfill existing rows from the user's profile
UPDATE memberships
SET client_id = profiles.client_id
FROM profiles
WHERE profiles.id = memberships.id_user;

-- Make it NOT NULL after backfill
ALTER TABLE memberships ALTER COLUMN client_id SET NOT NULL;
