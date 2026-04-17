-- Ghost Rate Database Schema

-- Companies
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  logo_url text,
  industry text,
  size text,
  website text,
  created_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  stage text not null check (stage in ('applied', 'phone_screen', 'final_round', 'offer')),
  application_date date not null,
  last_interaction_date date not null,
  received_acknowledgment boolean not null,
  communicated_timeline boolean not null,
  ghosted boolean not null,
  rounds_count integer not null default 1,
  received_rejection boolean not null,
  rejection_had_feedback boolean not null,
  overall_score integer not null check (overall_score between 1 and 5),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'flagged')),
  created_at timestamptz default now(),
  unique(user_id, company_id)
);

-- Flags
create table public.flags (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  reason text not null,
  created_at timestamptz default now(),
  unique(review_id, user_id)
);

-- RLS: enable on all tables
alter table public.companies enable row level security;
alter table public.reviews enable row level security;
alter table public.flags enable row level security;

-- Companies: anyone can read, authenticated users can insert
create policy "companies_read" on public.companies for select using (true);
create policy "companies_insert" on public.companies for insert with check (auth.role() = 'authenticated');

-- Reviews: only approved reviews are publicly visible
create policy "reviews_read" on public.reviews for select using (moderation_status = 'approved');
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_own_read" on public.reviews for select using (auth.uid() = user_id);

-- Flags: authenticated users can flag, can only see their own flags
create policy "flags_insert" on public.flags for insert with check (auth.uid() = user_id);
create policy "flags_own_read" on public.flags for select using (auth.uid() = user_id);

-- View: company scores (only from approved reviews, minimum 5)
create or replace view public.company_scores as
select
  c.id,
  c.name,
  c.domain,
  c.logo_url,
  c.industry,
  c.size,
  count(r.id) as review_count,
  round(avg(r.overall_score)::numeric, 1) as avg_score,
  round(avg(case when r.received_acknowledgment then 1 else 0 end)::numeric * 100) as acknowledgment_rate,
  round(avg(case when r.ghosted then 1 else 0 end)::numeric * 100) as ghost_rate,
  round(avg(case when r.received_rejection then 1 else 0 end)::numeric * 100) as rejection_rate,
  round(avg(case when r.rejection_had_feedback then 1 else 0 end)::numeric * 100) as feedback_rate
from public.companies c
left join public.reviews r on r.company_id = c.id and r.moderation_status = 'approved'
group by c.id
having count(r.id) >= 5 or count(r.id) = 0;
