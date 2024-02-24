const REVALIDATION_TIME_S = 10;
const LUMA_API_KEY = process.env.LUMA_API_KEY!;

interface Guest {
    email: string;
    approvalStatus: "approved" | "pending_approval";
}

type GuestRegistrationStatus = "approved" | "pending_approval" | "unregistered";

////
// Public functions
////

export async function getGuestRegistrationStatus(eventId: string, email: string): Promise<GuestRegistrationStatus> {
    const guest = (await getGuestsForEvent(eventId)).find((guest) => guest.email.toLowerCase() == email.toLowerCase());
    return guest == undefined ? "unregistered" : guest.approvalStatus;
}

export async function getNumApprovedGuestsForEvent(eventId: string): Promise<number> {
    return (await getGuestsForEvent(eventId)).reduce((n, guest) => (guest.approvalStatus == "approved" ? n + 1 : n), 0);
}

export async function isEventSoldOut(eventId: string, maxCapacity: number): Promise<boolean> {
    const numApprovedGuests = await getNumApprovedGuestsForEvent(eventId);
    return numApprovedGuests >= maxCapacity;
}

export async function registerGuestForEvent(
    eventId: string,
    ticketTypeId: string,
    guestEmail: string
): Promise<"success" | "invalid-email"> {
    const payload = JSON.stringify({
        name: " ",
        email: guestEmail,
        event_api_id: eventId,
        ticket_type_api_id_to_info: { [ticketTypeId]: { count: 1, amount: 0 } },
    });
    const request = await fetch("https://api.lu.ma/event/independent/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload,
        next: {
            revalidate: REVALIDATION_TIME_S,
        },
    });

    const response = await request.json();
    const status = response["status"];
    const message = response["message"];

    console.log(response);
    if (status == "success") {
        return "success";
    } else if (message.includes("valid email")) {
        return "invalid-email";
    } else {
        console.error("registerGuestForEvent - unexpected response", response);
        throw Error();
    }
}

export async function approveGuestForEvent(eventId: string, guestEmail: string) {
    const payload = JSON.stringify({
        guest: {
            type: "email",
            email: guestEmail,
        },
        status: "approved",
        event_api_id: eventId,
    });
    const request = await fetch("https://api.lu.ma/public/v1/event/update-guest-status", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-luma-api-key": LUMA_API_KEY,
        },
        body: payload,
        next: {
            revalidate: REVALIDATION_TIME_S,
        },
    });

    const response = await request.json();
    console.log("approveGuestForEvent - ", guestEmail, response);
}

////
// Private functions
////

async function getGuestsForEvent(eventId: string): Promise<Guest[]> {
    async function makePagenatedRequest(cursor: string | undefined) {
        const response = await fetch(
            `https://api.lu.ma/public/v1/event/get-guests?event_api_id=${eventId}&pagination_limit=1000${
                cursor ? "&pagination_cursor=" + cursor : ""
            }`,
            {
                headers: {
                    "x-luma-api-key": LUMA_API_KEY,
                },
                next: {
                    revalidate: REVALIDATION_TIME_S,
                },
            }
        );
        return await response.json();
    }

    let cursor = undefined;
    let guests: Guest[] = [];
    do {
        try {
            const response = await makePagenatedRequest(cursor);
            guests = guests.concat(
                response["entries"].map((entry: any) => {
                    const guestInfo = entry["guest"];
                    return { email: guestInfo["user_email"], approvalStatus: guestInfo["approval_status"] } as Guest;
                })
            );
            cursor = response["next_cursor"];
        } catch (e) {
            console.error("getGuestsForEvent: api error - ", e);
            cursor = undefined;
        }
    } while (cursor != undefined);

    guests = Array.from(new Set(guests)); // Remove any duplicates
    return guests;
}
