-- Indexes for fast analytics queries and lookups
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_created ON xp_ledger(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_streaks_user_habit ON streaks(user_id, habit_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_date ON notes(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_action ON audit_log(user_id, action);
