import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";
import { Database } from "@/supabase/codegen.types";
import { supabase } from "@/supabase/supabase";
import { revalidateTag } from "next/cache";

type BeanigotchiPersistentData = Database["public"]["Tables"]["beanigotchi"]["Row"];

interface GetPersistentDataParams {
  fid: number;
}

interface SetPersistentDataParams {
  data: BeanigotchiPersistentData;
}

async function getPersistentDataUncached({
  fid,
}: GetPersistentDataParams): Promise<{ data: BeanigotchiPersistentData; newEntry: boolean }> {
  const { data, error, status } = await supabase.from("beanigotchi").upsert({ fid }).select("*");

  if (error || data.length == 0) {
    throw Error(`beanigotchi getPersistentData - error ${JSON.stringify(error)}`);
  }

  return { data: data[0], newEntry: status == 201 };
}

export async function getPersistentData({
  fid,
}: GetPersistentDataParams): Promise<{ data: BeanigotchiPersistentData; newEntry: boolean }> {
  return customUnstableCache((fid: number) => getPersistentDataUncached({ fid }), ["beanigotchi-get-persistent-data"], {
    tags: [`beanigotchi-get-persistent-data-${fid}`],
  })(fid);
}

export async function setPersistentData({ data }: SetPersistentDataParams) {
  const { error } = await supabase.from("beanigotchi").update(data).eq("fid", data.fid);

  revalidateTag(`beanigotchi-get-persistent-data-${data.fid}`);

  if (error) {
    throw Error(`beanigotchi setPersistentData - error ${JSON.stringify(error)}`);
  }
}
