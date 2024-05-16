import "@/common/utils/bigIntPolyfill";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

export async function getData() {
  console.log("CACHE 1: MISS");
  return null;
}

export const getCachedData = customUnstableCache(getData, ["test-cache-get-data"], { revalidate: 5 });
