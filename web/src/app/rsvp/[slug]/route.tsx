import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { approveGuestForEvent, getGuestRegistrationStatus, isEventSoldOut, registerGuestForEvent } from "@/utils/luma";
import { getFrameHtmlResponse, FrameRequest, FrameButtonMetadata, FrameInputMetadata } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { SupportedRsvpSlug, rsvpConfigs } from "../configs";
import { isEmailValid } from "@/utils/validation";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = rsvpConfigs[params.slug as SupportedRsvpSlug];

    if (!config) {
        console.error("No config found - ", params.slug);
        return Response.error();
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image: config.images.home,
            buttons: [
                {
                    label: "Submit",
                    action: "post",
                },
            ],
            input: { text: "Enter email" },
            postUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/${params.slug}`,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = rsvpConfigs[params.slug as SupportedRsvpSlug];

    const { composing } = extractComposableQueryParams(req.nextUrl.searchParams);

    if (!config) {
        console.error("No config found - ", params.slug);
        return Response.error();
    }

    const frameRequest: FrameRequest = await req.json();
    const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

    if (!frameValidationResponse.isValid) {
        console.error(`Frame invalid - frameRequest=${frameRequest}`);
        return Response.error();
    }

    const framePayload = frameValidationResponse.message;
    const email = framePayload.input;
    const buttonNumber = framePayload.button;
    const displayName = framePayload.raw.action.interactor.username;
    const fid = framePayload.interactor.fid;
    const name = displayName + "-" + fid;

    const validEmail = isEmailValid(email);

    let image = config.images.home;
    let buttons: [FrameButtonMetadata, ...FrameButtonMetadata[]] = [
        {
            label: "View event",
            action: "link",
            target: config.eventUrl,
        },
        {
            label: "FREE Mint",
            action: "post",
        },
    ];
    let input: FrameInputMetadata | undefined = undefined;

    if (!composing && buttonNumber == 2) {
        // Compose to mint
        const composeResponse = await getComposeResponse(config.mintComposeTarget, frameRequest);
        return new NextResponse(composeResponse);
    }

    if (email == "") {
        input = { text: "Enter Email" };
        buttons = [
            {
                label: "Submit",
                action: "post",
            },
        ];
    } else if (!validEmail) {
        input = { text: "Invalid email, try again" };
        buttons = [
            {
                label: "Submit",
                action: "post",
            },
        ];
    } else {
        const registrationStatus = await getGuestRegistrationStatus(config.eventId, email);

        if (registrationStatus == "approved") {
            image = config.images.registered;
        } else if (registrationStatus == "pending_approval") {
            image = config.images.pendingApproval;
        } else {
            const soldOut = await isEventSoldOut(config.eventId, config.maxNumTickets);
            if (soldOut) {
                image = config.images.soldOut;
            } else {
                const meetsApprovalCriteria = await config.checkApprovalCriteria(framePayload);
                if (meetsApprovalCriteria) {
                    await registerGuestForEvent(config.eventId, config.ticketTypeId, name, email);
                    await approveGuestForEvent(config.eventId, email);
                    image = config.images.registered;
                } else {
                    const isActive = framePayload.raw.action.interactor.active_status == "active";
                    if (isActive) {
                        await registerGuestForEvent(config.eventId, config.ticketTypeId, name, email);
                        image = config.images.pendingApproval;
                    } else {
                        image = config.images.ineligible;
                    }
                }
            }
        }
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image,
            buttons,
            input,
            postUrl: `${process.env.NEXT_PUBLIC_URL}/rsvp/${params.slug}`,
        })
    );
}
