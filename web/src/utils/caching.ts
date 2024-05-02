import { unstable_cache } from "next/cache";
import { readContract } from "viem/actions";

export const cachedReadContract = unstable_cache(readContract, ["cached-read-contract"], { revalidate: 3600 });
