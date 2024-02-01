import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./codegen/types";

const cookieStore = cookies();

export const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
        },
    }
);
