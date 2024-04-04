export async function fetchIpfsData<T>(path: string): Promise<T | undefined> {
  const gatewayPath = path.replace("ipfs://", "https://ipfs.io/ipfs/");

  // Cache everything!
  try {
    const resp = await fetch(gatewayPath, { cache: "force-cache" });
    return (await resp.json()) as T;
  } catch (e) {
    console.error("fetchIpfsData - ", path, e);
    return undefined;
  }
}
