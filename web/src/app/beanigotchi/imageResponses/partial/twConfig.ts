import { SatoriOptions } from "satori";

export const twConfig: SatoriOptions["tailwindConfig"] = {
  theme: {
    extend: {
      colors: {
        content: {
          primary: "#FFFFFF",
          secondary: "#A0A0A0",
        },
        background: {
          primary: "#0A0A0A",
          secondary: "#191919",
        },
      },
      fontSize: {
        title: [
          "62px",
          {
            letterSpacing: "4.96px",
          },
        ],
        body: [
          "36px",
          {
            letterSpacing: "2.88px",
          },
        ],
        caption: [
          "28px",
          {
            letterSpacing: "0.28px",
          },
        ],
      },
    },
  },
};
