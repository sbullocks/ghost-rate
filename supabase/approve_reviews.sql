-- Run this in Supabase SQL Editor to approve all pending reviews for testing
update public.reviews set moderation_status = 'approved' where moderation_status = 'pending';

-- Also update the stage check constraint to include new stages
alter table public.reviews drop constraint reviews_stage_check;
alter table public.reviews add constraint reviews_stage_check
  check (stage in ('applied', 'phone_screen', 'technical_interview', 'take_home', 'final_round', 'offer'));
