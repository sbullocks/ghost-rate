-- Fix view permissions
grant select on public.company_scores to anon, authenticated;

-- Clean up duplicate test rows
delete from public.reviews
where company_id = (select id from public.companies where domain = 'google.com')
  and application_date in ('2025-01-10','2025-02-01','2025-03-05','2025-04-01','2025-05-01');

-- Re-add unique constraint cleanly
alter table public.reviews drop constraint if exists reviews_user_id_company_id_key;
alter table public.reviews add constraint reviews_user_id_company_id_key unique (user_id, company_id);

-- Insert 5 test reviews with distinct fake user IDs (bypasses FK for test data)
set session_replication_role = 'replica';

insert into public.reviews (
  user_id, company_id, stage, application_date, last_interaction_date,
  received_acknowledgment, communicated_timeline, ghosted,
  rounds_count, received_rejection, rejection_had_feedback,
  overall_score, moderation_status
)
select
  gen_random_uuid(),
  c.id,
  stage, app_date::date, last_date::date,
  ack, timeline, ghosted, rounds, rejection, feedback, score, 'approved'
from public.companies c,
(values
  ('phone_screen',        '2025-01-10', '2025-01-20', true,  true,  false, 2, true,  false, 3),
  ('applied',             '2025-02-01', '2025-02-01', false, false, true,  1, false, false, 1),
  ('final_round',         '2025-03-05', '2025-03-25', true,  true,  false, 3, true,  true,  5),
  ('technical_interview', '2025-04-01', '2025-04-10', true,  false, true,  2, false, false, 2),
  ('take_home',           '2025-05-01', '2025-05-15', true,  true,  false, 2, true,  false, 4)
) as t(stage, app_date, last_date, ack, timeline, ghosted, rounds, rejection, feedback, score)
where c.domain = 'google.com';

set session_replication_role = 'origin';
