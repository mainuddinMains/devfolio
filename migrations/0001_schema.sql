-- Devfolio D1 schema
-- One row per portfolio section, keyed by section name

CREATE TABLE IF NOT EXISTS portfolio_data (
  key        TEXT    PRIMARY KEY,
  value      TEXT    NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Seed empty rows for every section so GET always returns something
INSERT OR IGNORE INTO portfolio_data (key) VALUES
  ('pf_header'),
  ('pf_projects'),
  ('pf_experience'),
  ('pf_education'),
  ('pf_skills'),
  ('pf_extras'),
  ('pf_contact');
