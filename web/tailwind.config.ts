/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        superrare: {
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
          "superrare-title": [
            "16px",
            {
              lineHeight: "24px",
              letterSpacing: "0px",
              fontWeight: 400,
            },
          ],
        },
      },
    },
  },
};
