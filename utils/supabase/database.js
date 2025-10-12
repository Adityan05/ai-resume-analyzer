import { createClient } from "@/utils/supabase/server";

/**
 * Get user's recent scans
 * @param {string} userId - User ID
 * @param {number} limit - Number of scans to retrieve (default: 10)
 * @returns {Promise<Array>} Array of scan records
 */
export async function getUserRecentScans(userId, limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_scans")
    .select("id, filename, file_type, scan_date")
    .eq("user_id", userId)
    .order("scan_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching user scans:", error);
    throw new Error("Failed to fetch scan history");
  }

  return data || [];
}

/**
 * Get user's current credit balance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current credit balance
 */
export async function getUserCredits(userId) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user credits:", error);
      // If user doesn't have credits record, create one with default 500 credits
      if (error.code === "PGRST116") {
        return await createUserCredits(userId);
      }
      // Return default credits if there's any other error
      return 500;
    }

    return data.credits;
  } catch (error) {
    console.error("Error in getUserCredits:", error);
    return 500; // Return default credits as fallback
  }
}

/**
 * Create initial credits for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Initial credit balance (500)
 */
export async function createUserCredits(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_credits")
    .insert({ user_id: userId, credits: 500 })
    .select("credits")
    .single();

  if (error) {
    console.error("Error creating user credits:", error);
    throw new Error("Failed to create user credits");
  }

  return data.credits;
}

/**
 * Deduct credits from user's account
 * @param {string} userId - User ID
 * @param {number} amount - Amount to deduct
 * @returns {Promise<number>} Remaining credit balance
 */
export async function deductUserCredits(userId, amount) {
  const supabase = await createClient();

  // First check if user has enough credits
  const currentCredits = await getUserCredits(userId);

  if (currentCredits < amount) {
    throw new Error("Insufficient credits");
  }

  const { data, error } = await supabase
    .from("user_credits")
    .update({
      credits: currentCredits - amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("credits")
    .single();

  if (error) {
    console.error("Error deducting user credits:", error);
    throw new Error("Failed to deduct credits");
  }

  return data.credits;
}

/**
 * Record a scan in user's history
 * @param {string} userId - User ID
 * @param {string} filename - Name of the scanned file
 * @param {string} fileType - Type of the file (PDF, DOCX, etc.)
 * @returns {Promise<Object>} Created scan record
 */
export async function recordUserScan(userId, filename, fileType) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_scans")
    .insert({
      user_id: userId,
      filename: filename,
      file_type: fileType,
      scan_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error recording user scan:", error);
    throw new Error("Failed to record scan");
  }

  return data;
}

/**
 * Check if user has sufficient credits for a scan
 * @param {string} userId - User ID
 * @param {number} requiredCredits - Credits required for the operation
 * @returns {Promise<boolean>} True if user has sufficient credits
 */
export async function hasSufficientCredits(userId, requiredCredits = 50) {
  try {
    const currentCredits = await getUserCredits(userId);
    return currentCredits >= requiredCredits;
  } catch (error) {
    console.error("Error checking user credits:", error);
    return false;
  }
}
