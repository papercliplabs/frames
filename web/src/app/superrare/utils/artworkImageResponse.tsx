import ServerImage from "@/components/ServerImage";
import { truncateString } from "@/utils/format";
import { generateLayeredImageResponse } from "@/utils/generateLayeredImage";
import { localImageUrl } from "@/utils/urlHelpers";
import clsx from "clsx";
import { SatoriOptions } from "satori";

interface ArtworkImageResponseParams {
  artwork: {
    imgSrc: string;
    title: string;
  };

  artist: {
    name: string;
    imgSrc?: string;
  };

  tag?: {
    active: boolean;
    content: string;
  };

  extra?: {
    title: string;
    content: string;
  };
}

export function artworkImageResponse({ artwork, artist, tag, extra }: ArtworkImageResponseParams): Promise<Response> {
  return generateLayeredImageResponse({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0xff, g: 0xff, b: 0xff },
    twConfig,
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: artwork.imgSrc,
        size: { width: 600, height: 600 },
        animated: false,
      },
      {
        type: "static",
        src: "/images/superrare/overlay.png",
        size: { width: 600, height: 600 },
        animated: false,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-8 flex flex-col justify-between text-content-primary text-body">
            {tag ? (
              <div
                tw={clsx(
                  "flex px-4 py-2 rounded-[8px] border items-center mr-auto",
                  tag.active ? "bg-white text-black border-black/20" : "bg-background-secondary border-white/20"
                )}
                style={{ gap: "16px", flexShrink: 1 }}
              >
                {tag.active && (
                  <ServerImage src={localImageUrl("/superrare/active-icon.png")} width={24} height={24} alt="" />
                )}
                {tag.content}
              </div>
            ) : (
              <div />
            )}
            <div tw="flex flex-col w-full" style={{ gap: "32px" }}>
              <div
                tw="flex text-title max-w-full overflow-hidden"
                style={{
                  wordBreak: "break-word",
                }}
              >
                {truncateString(artwork.title, 70)}
              </div>
              <div tw="flex flex-row h-[68px] items-center" style={{ gap: "64px" }}>
                <div tw="flex flex-row items-center" style={{ gap: "16px" }}>
                  {/* TODO(spennyp): for some reason, using server image sometimes causes the image to not render */}
                  {artist.imgSrc && <img src={artist.imgSrc} width={56} height={56} alt="" tw="rounded-full" />}
                  <div tw="flex flex-col">
                    <div tw="text-caption text-content-secondary">Artist</div>
                    <div>{truncateString(artist.name, 21)}</div>
                  </div>
                </div>
                {extra && (
                  <div tw="flex flex-col">
                    <div tw="text-caption text-content-secondary">{extra.title}</div>
                    <div>{extra.content}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
        size: { width: 600, height: 600 },
      },
    ],
  });
}

export function errorImageResponse() {
  return generateLayeredImageResponse({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    twConfig,
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: "/images/superrare/overlay.png",
        size: { width: 600, height: 600 },
        animated: false,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-8 flex flex-col justify-center items-center text-content-primary text-body">
            Error: unable to find artwork data
          </div>
        ),
        size: { width: 600, height: 600 },
      },
    ],
  });
}

const twConfig: SatoriOptions["tailwindConfig"] = {
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
          "32px",
          {
            lineHeight: "48px",
            letterSpacing: "0px",
          },
        ],
        body: [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "0.3px",
          },
        ],
        caption: [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "0.3px",
          },
        ],
      },
    },
  },
};
