-- IAM1: database-backed users and roles (template baseline).
-- Postgres-specific; executed by Flyway (do not edit after shared environments apply it).

CREATE TABLE iam_role (
  id UUID PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE iam_user (
  id UUID PRIMARY KEY,
  email VARCHAR(320) UNIQUE,
  email_verified_at TIMESTAMPTZ,
  password_hash VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT true,
  failed_login_count INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE iam_user_role (
  user_id UUID NOT NULL REFERENCES iam_user(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES iam_role(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX iam_user_email_idx ON iam_user (email);
CREATE INDEX iam_user_enabled_idx ON iam_user (enabled);
CREATE INDEX iam_user_locked_until_idx ON iam_user (locked_until);

