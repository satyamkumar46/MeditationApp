import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://amunxmsgmuparezprlmv.supabase.co";
const supabaseAnonKey = "sb_publishable_WB5wIBs1P121Zb7FgQGVpg_NStPEdi8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
