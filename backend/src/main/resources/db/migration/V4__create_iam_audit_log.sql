-- IAM2: audit log for identity administration actions.

CREATE TABLE iam_audit_log (
  id UUID PRIMARY KEY,
  actor_user_id UUID NOT NULL,
  action VARCHAR(80) NOT NULL,
  target_user_id UUID,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX iam_audit_log_actor_idx ON iam_audit_log (actor_user_id);
CREATE INDEX iam_audit_log_target_idx ON iam_audit_log (target_user_id);
CREATE INDEX iam_audit_log_created_at_idx ON iam_audit_log (created_at);

