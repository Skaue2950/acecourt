import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, role, clubId, invitedBy, inviteUrl } = await req.json()

    // Validate inputs
    if (!email || !role || !clubId || !invitedBy) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: email, role, clubId, invitedBy',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('club_invitations')
      .insert({
        email,
        role,
        club_id: clubId,
        invited_by: invitedBy,
      })
      .select('token')
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return new Response(
        JSON.stringify({ error: inviteError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In production, you would send an email here using:
    // - Supabase Email
    // - Resend
    // - SendGrid
    // - etc.
    //
    // For now, we just return the token
    console.log(`Invitation created for ${email}: ${invitation.token}`)
    console.log(`Full invitation URL would be: ${inviteUrl}?token=${invitation.token}`)

    return new Response(
      JSON.stringify({
        success: true,
        token: invitation.token,
        message: `Invitation created for ${email}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
