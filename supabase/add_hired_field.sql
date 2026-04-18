-- Add hired field to reviews (nullable — question is optional)
alter table public.reviews add column if not exists hired boolean;

-- Update company_scores view to include hire_rate
-- hire_rate only counts reviews where hired was answered (not null)
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
  round(avg(case when r.rejection_had_feedback then 1 else 0 end)::numeric * 100) as feedback_rate,
  round(
    100.0 * count(case when r.hired = true then 1 end)::numeric /
    nullif(count(case when r.hired is not null then 1 end), 0)
  ) as hire_rate
from public.companies c
left join public.reviews r on r.company_id = c.id and r.moderation_status = 'approved'
group by c.id
having count(r.id) >= 5 or count(r.id) = 0;

grant select on public.company_scores to anon, authenticated;
