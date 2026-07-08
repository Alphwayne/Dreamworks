-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_slug TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Guest',
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Likes Table
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_slug TEXT,
    comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_slug, visitor_id, comment_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON blog_comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_slug ON blog_likes(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_likes_comment_id ON blog_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_visitor ON blog_likes(visitor_id);

-- Enable Row Level Security (optional - for public access)
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for blog comments
CREATE POLICY "Allow public read blog_comments" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert blog_comments" ON blog_comments FOR INSERT WITH CHECK (true);

-- Allow public read/write for blog likes
CREATE POLICY "Allow public read blog_likes" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert blog_likes" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete blog_likes" ON blog_likes FOR DELETE USING (true);
