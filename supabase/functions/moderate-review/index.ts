import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

    // User client — verifies the JWT via RLS
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

    const { review_id } = await req.json()
    if (!review_id) return new Response('Missing review_id', { status: 400, headers: corsHeaders })

    // Admin client — bypasses RLS for the update
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: review, error: reviewError } = await adminClient
      .from('reviews')
      .select('*')
      .eq('id', review_id)
      .eq('user_id', user.id)
      .single()

    if (reviewError || !review) return new Response('Review not found', { status: 404, headers: corsHeaders })

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `You are a content moderator for a job candidate review platform. Respond with ONLY valid JSON: {"status":"approved","reason":"..."} or {"status":"flagged","reason":"..."}.

Flag ONLY if: spam, clearly coordinated fake attack, or inappropriate content.
Approve if: genuine hiring experience regardless of whether positive or negative.

Submission:
- Stage: ${review.stage}
- Score: ${review.overall_score}/5
- Acknowledged: ${review.received_acknowledgment}
- Communicated timeline: ${review.communicated_timeline}
- Ghosted: ${review.ghosted}
- Received rejection: ${review.received_rejection}
- Rejection had feedback: ${review.rejection_had_feedback}
- Rounds: ${review.rounds_count}`
        }]
      })
    })

    const claudeData = await claudeRes.json()
    let result = { status: 'approved', reason: 'Auto-approved' }

    try {
      result = JSON.parse(claudeData.content[0].text)
    } catch {
      // Claude response unparseable — default to approved
    }

    await adminClient
      .from('reviews')
      .update({ moderation_status: result.status })
      .eq('id', review_id)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
