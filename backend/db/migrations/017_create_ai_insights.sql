-- 017_create_ai_insights.sql

CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    insight_text TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'motivation' CHECK (type IN ('motivation', 'warning', 'strategy', 'praise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quickly grabbing today's insight
CREATE INDEX idx_ai_insights_user_date ON ai_insights(user_id, created_at DESC);
