import { createClient } from "@supabase/supabase-js";
import { Database } from "./codegen.types";

export const supabase = createClient<Database>(
  "https://maigwjhtcdimlttkflad.supabase.co",
  process.env.SUPABASE_API_KEY!
);
