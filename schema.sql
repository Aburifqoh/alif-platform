-- ================================================================
-- ALIF — Al-Ibaanah Islamic Foundation Database Schema
-- Supabase / PostgreSQL
-- Version: 1.0.0
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- CORE: PROFILES & ROLES
-- ================================================================

-- Extend Supabase auth.users with profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  arabic_name     TEXT,
  phone           TEXT,
  date_of_birth   DATE,
  gender          TEXT CHECK (gender IN ('male', 'female')),
  nationality     TEXT DEFAULT 'Nigerian',
  state_of_origin TEXT,
  lga             TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  membership_id   TEXT UNIQUE,
  membership_type TEXT DEFAULT 'regular' CHECK (membership_type IN ('regular', 'student', 'youth', 'family', 'executive', 'honorary')),
  membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('pending', 'active', 'suspended', 'expired')),
  membership_start  DATE,
  membership_expiry DATE,
  occupation      TEXT,
  education_level TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- System roles
CREATE TABLE IF NOT EXISTS public.roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (name, label, description) VALUES
  ('super_admin',    'Super Admin',       'Full system access'),
  ('admin',          'Admin',             'Platform administration'),
  ('executive',      'Executive',         'Executive committee member'),
  ('committee',      'Committee Member',  'Department committee member'),
  ('finance_officer','Finance Officer',   'Manages finance records'),
  ('event_coordinator', 'Event Coordinator', 'Manages events'),
  ('welfare_officer','Welfare Officer',   'Manages welfare cases'),
  ('media_team',     'Media Team',        'Content and media management'),
  ('teacher',        'Teacher',           'Islamic education teacher'),
  ('hostel_manager', 'Hostel Manager',    'Manages hostel operations'),
  ('security',       'Security',          'Security personnel'),
  ('mosque_imam',    'Mosque Imam',       'Mosque imam'),
  ('guest_lecturer', 'Guest Lecturer',    'External lecturer'),
  ('volunteer',      'Volunteer',         'Organization volunteer'),
  ('member',         'Member',            'Regular member'),
  ('student',        'Student',           'Enrolled student'),
  ('hostel_resident','Hostel Resident',   'Hostel resident'),
  ('parent',         'Parent',            'Student parent/guardian'),
  ('visitor',        'Visitor',           'Public visitor')
ON CONFLICT (name) DO NOTHING;

-- User role assignments (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id    UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- ================================================================
-- ORGANIZATION STRUCTURE
-- ================================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  head_id     UUID REFERENCES public.profiles(id),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.departments (name, slug, description) VALUES
  ('Da''wah', 'dawah', 'Propagation and outreach activities'),
  ('Education', 'education', 'Islamic education and learning'),
  ('Youth', 'youth', 'Youth development and mentorship'),
  ('Women', 'women', 'Women affairs'),
  ('Hostel', 'hostel', 'Hostel management'),
  ('Media', 'media', 'Media and communications'),
  ('Finance', 'finance', 'Financial management'),
  ('Welfare', 'welfare', 'Welfare and community services'),
  ('Administration', 'administration', 'Organizational administration'),
  ('Community Service', 'community', 'Community outreach'),
  ('Events', 'events', 'Event planning and management'),
  ('Mosque Affairs', 'mosque', 'Mosque activities and management')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.committees (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  head_id       UUID REFERENCES public.profiles(id),
  description   TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- EVENTS
-- ================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE,
  description     TEXT,
  event_type      TEXT CHECK (event_type IN ('lecture', 'seminar', 'graduation', 'orientation', 'training', 'competition', 'dawah', 'community', 'conference', 'ramadan', 'eid', 'workshop', 'other')),
  start_datetime  TIMESTAMPTZ NOT NULL,
  end_datetime    TIMESTAMPTZ,
  location        TEXT,
  is_online       BOOLEAN DEFAULT false,
  meeting_link    TEXT,
  cover_image     TEXT,
  max_attendees   INTEGER,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  is_free         BOOLEAN DEFAULT true,
  price           DECIMAL(10,2) DEFAULT 0,
  department_id   UUID REFERENCES public.departments(id),
  created_by      UUID REFERENCES public.profiles(id),
  is_published    BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'waitlisted')),
  qr_code     TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ================================================================
-- EDUCATION (LMS)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.courses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  description   TEXT,
  category      TEXT CHECK (category IN ('quran', 'tajweed', 'hifdh', 'arabic', 'aqeedah', 'fiqh', 'hadith', 'tafseer', 'seerah', 'manners', 'youth', 'other')),
  level         TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  cover_image   TEXT,
  teacher_id    UUID REFERENCES public.profiles(id),
  department_id UUID REFERENCES public.departments(id),
  max_students  INTEGER,
  is_active     BOOLEAN DEFAULT true,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'suspended')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.quran_progress (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah       INTEGER CHECK (surah BETWEEN 1 AND 114),
  ayah_from   INTEGER,
  ayah_to     INTEGER,
  status      TEXT DEFAULT 'memorizing' CHECK (status IN ('memorizing', 'memorized', 'revising', 'completed')),
  teacher_id  UUID REFERENCES public.profiles(id),
  notes       TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- HOSTEL MANAGEMENT
-- ================================================================

CREATE TABLE IF NOT EXISTS public.hostels (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  gender      TEXT CHECK (gender IN ('male', 'female', 'mixed')),
  capacity    INTEGER,
  address     TEXT,
  manager_id  UUID REFERENCES public.profiles(id),
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id   UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor       INTEGER DEFAULT 1,
  capacity    INTEGER DEFAULT 1,
  room_type   TEXT DEFAULT 'shared' CHECK (room_type IN ('single', 'shared', 'suite')),
  amenities   JSONB DEFAULT '{}',
  monthly_fee DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  notes       TEXT,
  UNIQUE(hostel_id, room_number)
);

CREATE TABLE IF NOT EXISTS public.room_allocations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id         UUID NOT NULL REFERENCES public.rooms(id),
  resident_id     UUID NOT NULL REFERENCES public.profiles(id),
  move_in_date    DATE NOT NULL,
  move_out_date   DATE,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'vacated', 'suspended')),
  allocated_by    UUID REFERENCES public.profiles(id),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hostel_fees (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id          UUID NOT NULL REFERENCES public.profiles(id),
  room_id              UUID REFERENCES public.rooms(id),
  amount               DECIMAL(10,2) NOT NULL,
  period               TEXT,                          -- e.g. "2025/2026 Session"
  due_date             DATE,
  paid_date            DATE,
  status               TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'partial', 'waived')),
  payment_ref          TEXT,
  paystack_ref         TEXT,
  paystack_access_code TEXT,
  payment_channel      TEXT,                          -- card, bank_transfer, etc.
  fee_type             TEXT DEFAULT 'accommodation'
                       CHECK (fee_type IN ('accommodation', 'caution_deposit', 'service_charge', 'other')),
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- HOSTEL APPLICATIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS public.hostel_applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id         UUID REFERENCES public.hostels(id),
  preferred_room_id UUID REFERENCES public.rooms(id),
  room_type         TEXT CHECK (room_type IN ('single', 'shared', 'suite')),
  session           TEXT NOT NULL,           -- e.g. "2025/2026"
  purpose           TEXT CHECK (purpose IN ('student', 'worker', 'other')),
  next_of_kin_name  TEXT,
  next_of_kin_phone TEXT,
  next_of_kin_rel   TEXT,
  documents         JSONB DEFAULT '[]',      -- [{name, url, type, required}]
  status            TEXT DEFAULT 'pending'
                    CHECK (status IN ('pending','under_review','approved','rejected','waitlisted','cancelled')),
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  rejection_reason  TEXT,
  allocated_room_id UUID REFERENCES public.rooms(id),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Admin-configurable document requirements for hostel applications
-- Admins can add/remove required document types from the dashboard
CREATE TABLE IF NOT EXISTS public.hostel_document_requirements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,                  -- e.g. "Passport Photograph"
  slug        TEXT UNIQUE NOT NULL,           -- e.g. "passport"
  description TEXT,                           -- helper text shown to applicant
  is_required BOOLEAN DEFAULT true,
  accept_types TEXT DEFAULT 'image/*,.pdf',   -- file input accept attribute
  max_size_mb  INTEGER DEFAULT 2,
  sort_order   INTEGER DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Default document requirements (admin can add more later)
INSERT INTO public.hostel_document_requirements (name, slug, description, is_required, accept_types, sort_order) VALUES
  ('Passport Photograph',  'passport',   'Clear recent passport-size photo (JPG/PNG)',                    true,  'image/*',       1),
  ('Valid ID Card',         'id_card',    'NIN slip, student ID, NYSC card, voter's card, or national ID', true,  'image/*,.pdf',  2),
  ('Guarantor Letter',      'guarantor',  'Signed letter from a guarantor (parent, employer, etc.)',        false, 'image/*,.pdf',  3)
ON CONFLICT (slug) DO NOTHING;

-- Maintenance requests (must be created BEFORE RLS policies below)
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     UUID REFERENCES public.rooms(id),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id),
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status      TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id     UUID NOT NULL REFERENCES public.hostels(id),
  resident_id   UUID NOT NULL REFERENCES public.profiles(id),
  visitor_name  TEXT NOT NULL,
  visitor_phone TEXT,
  purpose       TEXT,
  check_in      TIMESTAMPTZ DEFAULT NOW(),
  check_out     TIMESTAMPTZ,
  approved_by   UUID REFERENCES public.profiles(id)
);

-- ================================================================
-- HOSTEL RLS POLICIES
-- ================================================================

ALTER TABLE public.hostel_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants see own applications"
  ON public.hostel_applications FOR SELECT
  USING (auth.uid() = applicant_id);
CREATE POLICY "Applicants can insert own applications"
  ON public.hostel_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Hostel managers can view all applications"
  ON public.hostel_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin', 'hostel_manager')
    )
  );
CREATE POLICY "Hostel managers can update applications"
  ON public.hostel_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin', 'hostel_manager')
    )
  );

ALTER TABLE public.hostel_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Residents see own fees"
  ON public.hostel_fees FOR SELECT
  USING (auth.uid() = resident_id);
CREATE POLICY "Finance and managers see all fees"
  ON public.hostel_fees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin', 'hostel_manager', 'finance_officer')
    )
  );

ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Residents see own maintenance requests"
  ON public.maintenance_requests FOR SELECT
  USING (auth.uid() = reporter_id);
CREATE POLICY "Residents can insert maintenance requests"
  ON public.maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Managers see all maintenance requests"
  ON public.maintenance_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'super_admin', 'hostel_manager')
    )
  );

-- ================================================================
-- DONATIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS public.donation_campaigns (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  description TEXT,
  campaign_type TEXT CHECK (campaign_type IN ('general', 'zakat', 'sadaqah', 'waqf', 'sponsor_student', 'sponsor_quran', 'sponsor_hostel', 'emergency', 'project')),
  goal_amount DECIMAL(12,2),
  raised_amount DECIMAL(12,2) DEFAULT 0,
  start_date  DATE,
  end_date    DATE,
  cover_image TEXT,
  is_active   BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id     UUID REFERENCES public.donation_campaigns(id),
  donor_id        UUID REFERENCES public.profiles(id),
  donor_name      TEXT,
  donor_email     TEXT,
  amount          DECIMAL(12,2) NOT NULL,
  currency        TEXT DEFAULT 'NGN',
  payment_ref     TEXT UNIQUE,
  payment_method  TEXT CHECK (payment_method IN ('paystack', 'bank_transfer', 'cash', 'other')),
  payment_status  TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed', 'refunded')),
  is_anonymous    BOOLEAN DEFAULT false,
  message         TEXT,
  receipt_sent    BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- WELFARE
-- ================================================================

CREATE TABLE IF NOT EXISTS public.welfare_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id  UUID NOT NULL REFERENCES public.profiles(id),
  request_type  TEXT CHECK (request_type IN ('emergency', 'food', 'education', 'medical', 'scholarship', 'other')),
  title         TEXT NOT NULL,
  description   TEXT,
  amount_needed DECIMAL(10,2),
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'disbursed', 'rejected', 'closed')),
  assigned_to   UUID REFERENCES public.profiles(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- FINANCE
-- ================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            TEXT CHECK (type IN ('income', 'expense', 'transfer')),
  category        TEXT,
  amount          DECIMAL(12,2) NOT NULL,
  currency        TEXT DEFAULT 'NGN',
  description     TEXT,
  reference       TEXT,
  department_id   UUID REFERENCES public.departments(id),
  recorded_by     UUID REFERENCES public.profiles(id),
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CONTENT (Articles/Blog)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.articles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  excerpt     TEXT,
  content     TEXT,
  cover_image TEXT,
  category    TEXT,
  tags        TEXT[],
  author_id   UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT false,
  is_featured  BOOLEAN DEFAULT false,
  views       INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- MOSQUE
-- ================================================================

CREATE TABLE IF NOT EXISTS public.mosque_prayer_times (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date      DATE UNIQUE,
  fajr      TIME,
  dhuhr     TIME,
  asr       TIME,
  maghrib   TIME,
  isha      TIME,
  jumu_ah   TIME,
  notes     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.khutbahs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  speaker_id  UUID REFERENCES public.profiles(id),
  speaker_name TEXT,
  date        DATE NOT NULL,
  audio_url   TEXT,
  video_url   TEXT,
  pdf_url     TEXT,
  summary     TEXT,
  category    TEXT,
  tags        TEXT[],
  views       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ANNOUNCEMENTS & NOTIFICATIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  audience    TEXT DEFAULT 'all' CHECK (audience IN ('all', 'members', 'students', 'hostel', 'teachers', 'executives')),
  priority    TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_by  UUID REFERENCES public.profiles(id),
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  is_active   BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- MEDIA
-- ================================================================

CREATE TABLE IF NOT EXISTS public.media_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT,
  description TEXT,
  file_url    TEXT NOT NULL,
  file_type   TEXT CHECK (file_type IN ('image', 'video', 'audio', 'document', 'other')),
  mime_type   TEXT,
  file_size   BIGINT,
  album_id    UUID,
  department_id UUID REFERENCES public.departments(id),
  uploaded_by UUID REFERENCES public.profiles(id),
  tags        TEXT[],
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.welfare_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all public profiles, only update their own
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: public can read published events
CREATE POLICY "Published events are public" ON public.events FOR SELECT USING (is_published = true);

-- Donations: users see own donations
CREATE POLICY "Users see own donations" ON public.donations FOR SELECT USING (auth.uid() = donor_id OR is_anonymous = false);

-- Welfare: users see own requests
CREATE POLICY "Users see own welfare requests" ON public.welfare_requests FOR SELECT USING (auth.uid() = requester_id);

-- Transactions: finance officers and admins only
CREATE POLICY "Finance access to transactions" ON public.transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin', 'finance_officer')
  )
);

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, membership_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'ALIF-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0')
  );

  -- Assign default 'member' role
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT NEW.id, r.id FROM public.roles r WHERE r.name = 'member';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER welfare_updated_at BEFORE UPDATE ON public.welfare_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER hostel_applications_updated_at BEFORE UPDATE ON public.hostel_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- SEED DATA — HOSTELS & ROOMS
-- ================================================================
-- Two hostels currently operational:
--   1. Al-Abraar       — Male only,  10 rooms
--   2. Sky Villa       — Three blocks:
--        Block A (Male)          — 16 rooms
--        Block B (Female)        — 22 rooms
--        Block C (Married)       —  2 suite rooms
--
-- Room naming: Al-Abraar → A01–A10
--              Sky Villa Male    → SV-M01–SV-M16
--              Sky Villa Female  → SV-F01–SV-F22
--              Sky Villa Married → SV-K01–SV-K02
--
-- All rooms default is_available = true at setup time.
-- Admin can mark individual rooms unavailable from the dashboard.
-- ================================================================

DO $$
DECLARE
  v_abraar_id  UUID;
  v_svmale_id  UUID;
  v_svfem_id   UUID;
  v_svmar_id   UUID;
  i            INTEGER;
BEGIN

  -- ── AL-ABRAAR (Male, 10 shared rooms) ───────────────────────
  INSERT INTO public.hostels (name, gender, capacity, address, description, is_active)
  VALUES (
    'Al-Abraar Hostel',
    'male',
    30,  -- approx 3 per shared room × 10 rooms
    'ALIF Campus, Abuja, Nigeria',
    'Male hostel with 10 shared rooms. Named after Al-Abraar — the righteous.',
    true
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_abraar_id;

  -- If hostel already existed, fetch its id
  IF v_abraar_id IS NULL THEN
    SELECT id INTO v_abraar_id FROM public.hostels WHERE name = 'Al-Abraar Hostel' LIMIT 1;
  END IF;

  FOR i IN 1..10 LOOP
    INSERT INTO public.rooms (hostel_id, room_number, floor, capacity, room_type, monthly_fee, is_available)
    VALUES (
      v_abraar_id,
      'A' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i <= 5 THEN 1 ELSE 2 END,
      3,       -- 3 beds per shared room
      'shared',
      15000,   -- ₦15,000 / month (adjust as needed)
      true
    )
    ON CONFLICT (hostel_id, room_number) DO NOTHING;
  END LOOP;

  -- ── SKY VILLA — MALE BLOCK (16 shared rooms) ────────────────
  INSERT INTO public.hostels (name, gender, capacity, address, description, is_active)
  VALUES (
    'Sky Villa — Male Block',
    'male',
    48,  -- 3 per room × 16
    'Sky Villa, ALIF Campus, Abuja, Nigeria',
    'Sky Villa Male Block — 16 shared rooms. Clean, modern student accommodation.',
    true
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_svmale_id;

  IF v_svmale_id IS NULL THEN
    SELECT id INTO v_svmale_id FROM public.hostels WHERE name = 'Sky Villa — Male Block' LIMIT 1;
  END IF;

  FOR i IN 1..16 LOOP
    INSERT INTO public.rooms (hostel_id, room_number, floor, capacity, room_type, monthly_fee, is_available)
    VALUES (
      v_svmale_id,
      'SV-M' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i <= 8 THEN 1 ELSE 2 END,
      3,
      'shared',
      18000,
      true
    )
    ON CONFLICT (hostel_id, room_number) DO NOTHING;
  END LOOP;

  -- ── SKY VILLA — FEMALE BLOCK (22 shared rooms) ──────────────
  INSERT INTO public.hostels (name, gender, capacity, address, description, is_active)
  VALUES (
    'Sky Villa — Female Block',
    'female',
    66,  -- 3 per room × 22
    'Sky Villa, ALIF Campus, Abuja, Nigeria',
    'Sky Villa Female Block — 22 shared rooms. Safe, comfortable women-only accommodation.',
    true
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_svfem_id;

  IF v_svfem_id IS NULL THEN
    SELECT id INTO v_svfem_id FROM public.hostels WHERE name = 'Sky Villa — Female Block' LIMIT 1;
  END IF;

  FOR i IN 1..22 LOOP
    INSERT INTO public.rooms (hostel_id, room_number, floor, capacity, room_type, monthly_fee, is_available)
    VALUES (
      v_svfem_id,
      'SV-F' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i <= 11 THEN 1 ELSE 2 END,
      3,
      'shared',
      18000,
      true
    )
    ON CONFLICT (hostel_id, room_number) DO NOTHING;
  END LOOP;

  -- ── SKY VILLA — MARRIED QUARTERS (2 suite rooms) ────────────
  INSERT INTO public.hostels (name, gender, capacity, address, description, is_active)
  VALUES (
    'Sky Villa — Married Quarters',
    'mixed',
    4,
    'Sky Villa, ALIF Campus, Abuja, Nigeria',
    'Sky Villa Married Quarters — 2 self-contained suite rooms for married students.',
    true
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_svmar_id;

  IF v_svmar_id IS NULL THEN
    SELECT id INTO v_svmar_id FROM public.hostels WHERE name = 'Sky Villa — Married Quarters' LIMIT 1;
  END IF;

  FOR i IN 1..2 LOOP
    INSERT INTO public.rooms (hostel_id, room_number, floor, capacity, room_type, monthly_fee, is_available)
    VALUES (
      v_svmar_id,
      'SV-K' || LPAD(i::TEXT, 2, '0'),
      1,
      2,       -- 2 occupants (couple)
      'suite',
      35000,
      true
    )
    ON CONFLICT (hostel_id, room_number) DO NOTHING;
  END LOOP;

END $$;

-- ================================================================
-- COMMERCE COMMUNITY (MARKETPLACE)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.marketplace_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Default categories
INSERT INTO public.marketplace_categories (name, slug, description) VALUES
  ('Islamic Books', 'books', 'Islamic literature and academic texts'),
  ('Clothing & Apparel', 'clothing', 'Modest wears, abayas, thawbs, and more'),
  ('Food & Groceries', 'food', 'Halal food and groceries'),
  ('Electronics', 'electronics', 'Phones, laptops, and gadgets'),
  ('Home & Household', 'home', 'Furniture and home appliances'),
  ('Services', 'services', 'Professional services by members'),
  ('Education', 'education', 'Tutoring and courses'),
  ('Hajj & Umrah', 'hajj-umrah', 'Travel packages and essentials'),
  ('Business & B2B', 'business', 'Wholesale and business supplies'),
  ('Other', 'other', 'Miscellaneous items')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.marketplace_seller_profiles (
  id              UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  business_desc   TEXT,
  whatsapp_number TEXT NOT NULL,
  location_state  TEXT,
  location_city   TEXT,
  is_verified     BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id       UUID NOT NULL REFERENCES public.marketplace_seller_profiles(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES public.marketplace_categories(id),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE,
  description     TEXT NOT NULL,
  price           DECIMAL(12,2) NOT NULL,
  is_negotiable   BOOLEAN DEFAULT false,
  condition       TEXT CHECK (condition IN ('new', 'used_like_new', 'used_good', 'used_fair')),
  images          TEXT[] DEFAULT '{}',
  location_state  TEXT,
  location_city   TEXT,
  fulfillment     TEXT CHECK (fulfillment IN ('pickup', 'delivery', 'both')),
  status          TEXT DEFAULT 'pending_review' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'sold', 'expired', 'suspended', 'deleted')),
  views           INTEGER DEFAULT 0,
  approved_by     UUID REFERENCES public.profiles(id),
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CAMPAIGNS & POINTS SYSTEM (V1)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE,
  description     TEXT,
  content         TEXT,
  cover_image     TEXT,
  target_url      TEXT,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'archived')),
  start_date      TIMESTAMPTZ,
  end_date        TIMESTAMPTZ,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaign_participants (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id       UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code     TEXT UNIQUE NOT NULL,
  shares_count      INTEGER DEFAULT 0,
  qualified_actions INTEGER DEFAULT 0,
  points_earned     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.points_rules (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity          TEXT UNIQUE NOT NULL,
  points_amount     INTEGER NOT NULL,
  action_limit      INTEGER,
  limit_period      TEXT DEFAULT 'campaign' CHECK (limit_period IN ('campaign', 'daily', 'weekly', 'monthly', 'lifetime')),
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.points_rules (activity, points_amount, action_limit, limit_period) VALUES
  ('campaign_share', 5, 3, 'campaign'),
  ('qualifying_referral', 20, 10, 'campaign')
ON CONFLICT (activity) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.points_ledger (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points_amount   INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  source_type     TEXT CHECK (source_type IN ('campaign', 'referral', 'admin_adjustment', 'reward_redemption')),
  source_id       UUID,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'reversed')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  verified_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ
);

COMMENT ON TABLE public.points_ledger IS 'Points are not monetary currency and are not redeemable for cash in V1. They represent internal community recognition/reward points.';

-- ================================================================
-- MARKETPLACE & CAMPAIGNS RLS POLICIES
-- ================================================================

ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public categories are viewable" ON public.marketplace_categories FOR SELECT USING (is_active = true);

ALTER TABLE public.marketplace_seller_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public seller profiles are viewable" ON public.marketplace_seller_profiles FOR SELECT USING (status = 'active');
CREATE POLICY "Users can update own seller profile" ON public.marketplace_seller_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own seller profile" ON public.marketplace_seller_profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved listings are public" ON public.marketplace_listings FOR SELECT USING (status = 'approved');
CREATE POLICY "Sellers can view own listings" ON public.marketplace_listings FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON public.marketplace_listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can insert own listings" ON public.marketplace_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Admins can manage all listings" ON public.marketplace_listings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin')
  )
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active campaigns are public" ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage all campaigns" ON public.campaigns FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin', 'media_team')
  )
);

ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own participation" ON public.campaign_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own participation" ON public.campaign_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own points" ON public.points_ledger FOR SELECT USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER marketplace_seller_profiles_updated_at BEFORE UPDATE ON public.marketplace_seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER marketplace_listings_updated_at BEFORE UPDATE ON public.marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER points_rules_updated_at BEFORE UPDATE ON public.points_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- END OF SCHEMA
-- Version: 2.0.0
-- Last updated: 2026-08
-- Hostels seeded: Al-Abraar (10 rooms) + Sky Villa (16M + 22F + 2 married)
-- New: hostel_applications, hostel_fees (extended), hostel_document_requirements
-- ================================================================
