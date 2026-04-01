import { supabase } from "../utility/supabase";

/**
 * Streak Service — persists meditation streaks in the `profiles` table.
 *
 * Columns used:
 *   - streak_count   (int4)
 *   - last_activity  (date)
 *   - total_sessions (int8)
 *   - total_minutes  (int8)
 */

const getCurrentUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
};

// ========== FETCH STREAK ==========
export const fetchStreak = async () => {
  const userId = await getCurrentUserId();
  if (!userId)
    return {
      streak_count: 0,
      last_activity: null,
      total_sessions: 0,
      total_minutes: 0,
    };

  const { data, error } = await supabase
    .from("profiles")
    .select("streak_count, last_activity, total_sessions, total_minutes")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return {
      streak_count: 0,
      last_activity: null,
      total_sessions: 0,
      total_minutes: 0,
    };
  }

  return data;
};

// ========== UPDATE STREAK ==========
export const updateStreakInDB = async (streakCount, lastActivity) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await supabase
    .from("profiles")
    .update({
      streak_count: streakCount,
      last_activity: lastActivity,
    })
    .eq("id", userId);
};

// ========== UPDATE SESSION STATS ==========
export const updateSessionStatsInDB = async (
  totalSessions,
  totalMinutes,
  lastActivity
) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await supabase
    .from("profiles")
    .update({
      total_sessions: totalSessions,
      total_minutes: totalMinutes,
      last_activity: lastActivity,
    })
    .eq("id", userId);
};
