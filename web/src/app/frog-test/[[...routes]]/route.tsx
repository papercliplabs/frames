/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";
import { neynar } from "frog/hubs";

const app = new Frog({
    basePath: "/frog-test/",
    browserLocation: "https://paperclip.xyz",
    // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY! }),
});

app.frame("/hello", (c) => {
    const { buttonValue, status } = c;
    return c.res({
        image: (
            <div style={{ color: "white", display: "flex", fontSize: 60 }}>
                {status === "initial" ? "Select your fruit!" : `Selected: ${buttonValue}`}
            </div>
        ),
        action: `${process.env.NEXT_PUBLIC_URL}/frog-test/hello`,
        intents: [
            <Button value="apple" action={`${process.env.NEXT_PUBLIC_URL}/frog-test/hello`}>
                Apple
            </Button>,
            <Button value="banana">Banana</Button>,
            <Button value="mango">Mango</Button>,
            <Button.Transaction target="/send-ether">SEND</Button.Transaction>,
        ],
    });
});

app.transaction("/send-ether", (c) => {
    const { inputText } = c;
    // Send transaction response.
    return c.send({
        chainId: "eip155:10",
        to: "0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7",
        value: BigInt(1000000000),
    });
});

export const GET = handle(app);
export const POST = handle(app);
