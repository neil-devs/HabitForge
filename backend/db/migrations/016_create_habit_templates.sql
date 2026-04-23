CREATE TABLE IF NOT EXISTS habit_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji VARCHAR(10) DEFAULT '📝',
    color VARCHAR(20) DEFAULT '#f59e0b',
    category VARCHAR(50) CHECK (category IN ('health', 'fitness', 'learning', 'mindfulness', 'nutrition', 'productivity', 'social', 'finance', 'custom')),
    frequency_type VARCHAR(50) DEFAULT 'daily',
    frequency_days INTEGER[] DEFAULT '{}',
    goal_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
