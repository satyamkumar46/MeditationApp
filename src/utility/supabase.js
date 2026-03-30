import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://amunxmsgmuparezprlmv.supabase.co";
const supabaseAnonKey = "sb_publishable_WB5wIBs1P121Zb7FgQGVpg_NStPEdi8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
