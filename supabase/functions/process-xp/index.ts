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
    const { playerId, sessionId, attendanceStatus, mdeTotal } = await req.json()

    // Validate inputs
    if (!playerId || !sessionId) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: playerId, sessionId',
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

    // Calculate XP to award
    let xpToAward = 0

    // Base XP for attendance
    if (attendanceStatus === 'present') {
      xpToAward = 50
    } else if (attendanceStatus === 'late') {
      xpToAward = 25
    } else if (attendanceStatus === 'excused') {
      xpToAward = 10
    }

    // Bonus for MDE (average of motivation, development, engagement)
    if (mdeTotal) {
      const mdeBonus = mdeTotal * 10
      xpToAward += Math.min(mdeBonus, 150) // Cap MDE bonus at 150
    }

    // Get player current level and XP
    const { data: playerData, error: playerError } = await supabase
      .from('profiles')
      .select('id, xp, level')
      .eq('id', playerId)
      .single()

    if (playerError) {
      console.error('Error fetching player:', playerError)
      return new Response(
        JSON.stringify({ error: 'Player not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update player XP
    const newXp = (playerData.xp || 0) + xpToAward

    // Calculate new level (simplified: 1000 XP per level)
    const xpPerLevel = 1000
    const newLevel = Math.floor(newXp / xpPerLevel) + 1

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: newXp,
        level: newLevel,
      })
      .eq('id', playerId)

    if (updateError) {
      console.error('Error updating player:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update player' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check for level up
    const leveledUp = newLevel > (playerData.level || 1)

    // In a real app, you would:
    // - Check for badge unlocks
    // - Update leaderboard entries
    // - Trigger notifications
    // - etc.

    return new Response(
      JSON.stringify({
        success: true,
        xpAwarded: xpToAward,
        newXp,
        newLevel,
        leveledUp,
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
