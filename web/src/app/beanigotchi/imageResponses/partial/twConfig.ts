import { SatoriOptions } from "satori";
import { SCALER } from "../../utils/constants";

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
          `${62 * SCALER}px`,
          {
            letterSpacing: `${4.96 * SCALER}px`,
          },
        ],
        body: [
          `${36 * SCALER}px`,
          {
            letterSpacing: `${2.88 * SCALER}px`,
          },
        ],
        caption: [
          `${28 * SCALER}px`,
          {
            letterSpacing: `${0.28 * SCALER}px`,
          },
        ],
      },
    },
  },
};
