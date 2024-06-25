import { supabase } from "@/supabase/supabase";

export async function isUserOnWaitlist(fid: number): Promise<boolean> {
  const { error, data } = await supabase.from("nouns-town-waitlist").select("fid").eq("fid", fid);

  if (error) {
    console.error(`Error checking is user is on waitlist: ${fid} - ${JSON.stringify(error)}`);
  }

  return data ? data.length > 0 : false;
}

export async function addUserToWaitlist(fid: number) {
  const { error } = await supabase.from("nouns-town-waitlist").insert({ fid });
  if (error) {
    console.error(`Error adding user to waitlist: ${fid} - ${JSON.stringify(error)}`);
  }
}
