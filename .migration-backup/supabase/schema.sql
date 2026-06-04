CREATE TYPE opportunity_type AS ENUM (
    'Scholarship',
    'Competition',
    'Internship',
    'Workshop',
    'Summer Program',
    'Exchange Program',
    'Other'
);

CREATE TYPE status AS ENUM (
    'Saved',
    'Planning',
    'Applying',
    'Submitted',
    'Accepted',
    'Rejected'
);

CREATE TABLE opportunities (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    organization TEXT,
    description TEXT,
    application_link TEXT,
    opportunity_type opportunity_type,
    deadline DATE,
    status status,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON opportunities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
