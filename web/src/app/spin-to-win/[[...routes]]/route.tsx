/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { SupportedSpinToWinSlug, spinToWinConfigs } from "../configs";
import { neynar } from "frog/hubs";

const app = new Frog({
    hub: neynar({ apiKey: process.env.NEYNAR_API_KEY! }),
    // verify: false, // Doesn't work when left out in local debugger...
});

app.frame("/spin-to-win/:slug", async (context) => {
    const { status, frameData } = context;
    const slug = context.req.param("slug");
    const config = spinToWinConfigs[slug as SupportedSpinToWinSlug];

    if (!config) {
        throw Error(`No config found for slug=${slug}`);
    }

    // Need to disable this rule for now, since the intents array violates inside from
    /* eslint-disable react/jsx-key*/
    if (status == "initial" || frameData == undefined) {
        return context.res({
            ...config.images.home,
            intents: [<Button value="spin">Spin</Button>],
        });
    } else if (await config.isSoldOut()) {
        return context.res({
            ...config.images.soldOut,
            intents: [
                <Button.Link href={config.externalLinkConfig.href}>{config.externalLinkConfig.title}</Button.Link>,
            ],
        });
    } else if (await config.didAlreadySpin(frameData!.fid)) {
        return context.res({
            ...config.images.alreadySpun,
            intents: [
                <Button.Link href={config.externalLinkConfig.href}>{config.externalLinkConfig.title}</Button.Link>,
            ],
        });
    } else {
        return context.res({
            ...(await config.runSpin(frameData)),
            intents: [
                <Button.Link href={config.externalLinkConfig.href}>{config.externalLinkConfig.title}</Button.Link>,
            ],
        });
    }
    /* eslint-enable react/jsx-key*/
});

export const GET = handle(app);
export const POST = handle(app);
