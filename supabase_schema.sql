-- ==============================================================================
-- ResQ Assam Unified Disaster Management Platform - PostgreSQL / Supabase Schema
-- Database DDL for Emergency Telemetry, Incidents, Camps, Volunteers, & Donations
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. INCIDENTS TABLE (Emergency SOS Reports)
CREATE TABLE IF NOT EXISTS public.incidents (
    id VARCHAR(50) PRIMARY KEY,
    reporter_name VARCHAR(255) NOT NULL,
    reporter_phone VARCHAR(50) NOT NULL,
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    disaster_type VARCHAR(50) NOT NULL DEFAULT 'flood',
    severity VARCHAR(20) NOT NULL DEFAULT 'critical',
    demographics JSONB NOT NULL DEFAULT '{"adults": 1, "children": 0, "elderly": 0, "disabled": 0, "pregnant": 0, "animals": 0}',
    needs JSONB NOT NULL DEFAULT '{"food": true, "water": true, "medicine": false, "boat": true, "evacuation": true, "livestock": false}',
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    ai_vulnerability_score INT NOT NULL DEFAULT 50,
    is_ai_duplicate BOOLEAN DEFAULT FALSE,
    assigned_team_id VARCHAR(50),
    assigned_team_name VARCHAR(255),
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    voice_note_url TEXT,
    rescue_photo_proof TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_district ON public.incidents(district);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON public.incidents(severity);

-- 3. RELIEF CAMPS TABLE
CREATE TABLE IF NOT EXISTS public.relief_camps (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    capacity INT NOT NULL DEFAULT 500,
    current_occupancy INT NOT NULL DEFAULT 0,
    contact_phone VARCHAR(50) NOT NULL,
    in_charge VARCHAR(255) NOT NULL,
    amenities JSONB NOT NULL DEFAULT '{"foodWater": true, "medicalBay": true, "womenChildSafe": true, "petFriendly": true, "powerBackup": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_camps_district ON public.relief_camps(district);

-- 4. VOLUNTEERS TABLE (State Volunteer Corps)
CREATE TABLE IF NOT EXISTS public.volunteers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    serviceable_area VARCHAR(255),
    skills TEXT[] NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    tasks_assigned INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_volunteers_district ON public.volunteers(district);
CREATE INDEX IF NOT EXISTS idx_volunteers_verified ON public.volunteers(is_verified);

-- 5. NGO INVENTORIES TABLE
CREATE TABLE IF NOT EXISTS public.ngo_inventories (
    id VARCHAR(50) PRIMARY KEY,
    ngo_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    items JSONB NOT NULL DEFAULT '{"foodPacks": 0, "waterLitres": 0, "medicines": 0, "blankets": 0, "mosquitoNets": 0, "animalFeedKg": 0}',
    distribution_count INT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MISSING PERSONS TABLE
CREATE TABLE IF NOT EXISTS public.missing_persons (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    last_seen_location VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    date_missing VARCHAR(50) NOT NULL,
    photo_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'missing',
    reporter_name VARCHAR(255) NOT NULL,
    reporter_phone VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ROAD REPORTS TABLE (Road Hazards & Telemetrics)
CREATE TABLE IF NOT EXISTS public.road_reports (
    id VARCHAR(50) PRIMARY KEY,
    road_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'waterlogged',
    details TEXT NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    photo_url TEXT,
    telemetrics JSONB,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. DISASTER ALERTS TABLE (ASDMA Bulletins)
CREATE TABLE IF NOT EXISTS public.disaster_alerts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'flood',
    severity VARCHAR(20) NOT NULL DEFAULT 'critical',
    district VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    action_required TEXT NOT NULL,
    river_level VARCHAR(50),
    dam_status VARCHAR(50),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. DONATIONS TABLE (Razorpay Live & 80G Tax Receipts)
CREATE TABLE IF NOT EXISTS public.donations (
    id VARCHAR(50) PRIMARY KEY,
    receipt_no VARCHAR(100) NOT NULL UNIQUE,
    donor_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2),
    item_type VARCHAR(255),
    item_quantity VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_receipt ON public.donations(receipt_no);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES FOR PUBLIC READ & AUTHORIZED WRITE
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relief_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all emergency tables
CREATE POLICY "Public Read Access Incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Public Insert Access Incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Incidents" ON public.incidents FOR UPDATE USING (true);

CREATE POLICY "Public Read Access Camps" ON public.relief_camps FOR SELECT USING (true);
CREATE POLICY "Public Insert Access Camps" ON public.relief_camps FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access Volunteers" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Public Insert Access Volunteers" ON public.volunteers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access Donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Public Insert Access Donations" ON public.donations FOR INSERT WITH CHECK (true);
