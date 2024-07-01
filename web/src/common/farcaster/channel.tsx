async function getUserChannels(fid: number): Promise<string[]> {
  async function makePagenatedRequest(cursor: string | undefined) {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/channels?fid=${fid}&limit=100${cursor ? "&cursor=" + cursor : ""}`,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY!,
        },
        next: {
          revalidate: 0,
        },
      }
    );
    return await res.json();
  }

  let cursor = undefined;
  let channelIds: string[] = [];
  do {
    const resp = await makePagenatedRequest(cursor);
    try {
      channelIds = channelIds.concat(resp["channels"].map((c: any) => c["id"]));
      cursor = resp["next"]["cursor"];
    } catch (e) {
      console.error("getUserChannels: api error - ", e, resp);
      cursor = undefined;
    }
  } while (cursor != undefined);

  channelIds = Array.from(new Set(channelIds)); // Remove any duplicates
  return channelIds;
}

export async function isUserFollowingChannel(fid: number, channelId: string): Promise<boolean> {
  const channelIds = await getUserChannels(fid);
  return channelIds.includes(channelId);
}
