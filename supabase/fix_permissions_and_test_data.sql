-- Fix view permissions
grant select on public.company_scores to anon, authenticated;

-- Drop unique constraint temporarily to allow test reviews from same user
alter table public.reviews drop constraint reviews_user_id_company_id_key;

-- Insert 5 varied test reviews for Google
do $$
declare
  v_user_id uuid;
  v_company_id uuid;
begin
  select id into v_user_id from auth.users limit 1;
  select id into v_company_id from public.companies where domain = 'google.com';

  insert into public.reviews (
    user_id, company_id, stage, application_date, last_interaction_date,
    received_acknowledgment, communicated_timeline, ghosted,
    rounds_count, received_rejection, rejection_had_feedback,
    overall_score, moderation_status
  ) values
    (v_user_id, v_company_id, 'phone_screen',         '2025-01-10', '2025-01-20', true,  true,  false, 2, true,  false, 3, 'approved'),
    (v_user_id, v_company_id, 'applied',              '2025-02-01', '2025-02-01', false, false, true,  1, false, false, 1, 'approved'),
    (v_user_id, v_company_id, 'final_round',          '2025-03-05', '2025-03-25', true,  true,  false, 3, true,  true,  5, 'approved'),
    (v_user_id, v_company_id, 'technical_interview',  '2025-04-01', '2025-04-10', true,  false, true,  2, false, false, 2, 'approved'),
    (v_user_id, v_company_id, 'take_home',            '2025-05-01', '2025-05-15', true,  true,  false, 2, true,  false, 4, 'approved');
end $$;

-- Re-add unique constraint
alter table public.reviews add constraint reviews_user_id_company_id_key unique (user_id, company_id);
