import { supabase } from "@/supabase/supabase";

export async function storeTransactionIsApproval(uuid: string, isApproval: boolean) {
  try {
    const resp = await supabase.from("erc-20-transactions").upsert({ uuid, isApproval });

    if (resp.error) {
      console.error("Error storing ERC-20 transaction", resp.error);
    }
  } catch (e) {
    console.error("Caught error storing ERC-20 transaction", e);
  }
}

export async function getIsTransactionApproval(uuid: string): Promise<boolean> {
  try {
    const resp = await supabase.from("erc-20-transactions").select("isApproval").eq("uuid", uuid);

    if (resp.error) {
      console.error("Error fetching ERC-20 transaction", resp.error);
      return false;
    }

    if (resp.data.length != 1) {
      // 0 is ok for ETH
      if (resp.data.length > 1) {
        console.error("Error invalid number of ERC-20 transactions returned", resp.data);
      }
      return false;
    }

    return resp.data[0].isApproval;
  } catch (e) {
    console.error("Caught error fetching ERC-20 transactions", e);
    return false;
  }
}
