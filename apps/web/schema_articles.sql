-- ================================================================
-- ALIF — Articles / Blog Database Schema
-- Supabase / PostgreSQL
-- ================================================================

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  content         TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_approved     BOOLEAN DEFAULT false,
  approved_by     UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can read approved articles" ON public.articles;
CREATE POLICY "Anyone can read approved articles" ON public.articles
  FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Authors can read their own articles" ON public.articles;
CREATE POLICY "Authors can read their own articles" ON public.articles
  FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
CREATE POLICY "Authenticated users can insert articles" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their own unapproved articles" ON public.articles;
CREATE POLICY "Authors can update their own unapproved articles" ON public.articles
  FOR UPDATE USING (auth.uid() = author_id AND is_approved = false);

DROP POLICY IF EXISTS "Admins can manage all articles" ON public.articles;
CREATE POLICY "Admins can manage all articles" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin')
    )
  );
