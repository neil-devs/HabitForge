CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji VARCHAR(10) DEFAULT '📝',
    color VARCHAR(20) DEFAULT '#f59e0b',
    category VARCHAR(50) DEFAULT 'custom' CHECK (category IN ('health', 'fitness', 'learning', 'mindfulness', 'nutrition', 'productivity', 'social', 'finance', 'custom')),
    frequency_type VARCHAR(50) DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekdays', 'weekends', 'custom')),
    frequency_days INTEGER[] DEFAULT '{}',
    goal_days INTEGER DEFAULT 30,
    xp_per_completion INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
