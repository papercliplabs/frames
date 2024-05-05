import ServerImage from "@/components/ServerImage";
import { truncateString } from "@/utils/format";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { ImageLayer } from "@/utils/generateImage/types";
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
  return generateImageResponse({
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    twConfig,
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: artwork.imgSrc,
        size: { width: 1200, height: 1200 },
        animated: false,
      },
      {
        type: "static",
        src: "/images/superrare/overlay.png",
        size: { width: 1200, height: 1200 },
        animated: false,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-16 flex flex-col justify-between text-content-primary text-body">
            {tag ? (
              <div
                tw={clsx(
                  "flex px-8 py-4 rounded-[16px] border items-center mr-auto",
                  tag.active ? "bg-white text-black border-black/20" : "bg-background-secondary border-white/20"
                )}
                style={{ gap: "32px", flexShrink: 1 }}
              >
                {tag.active && (
                  <ServerImage src={localImageUrl("/superrare/active-icon.png")} width={48} height={48} alt="" />
                )}
                {tag.content}
              </div>
            ) : (
              <div />
            )}
            <div tw="flex flex-col w-full" style={{ gap: "64px" }}>
              <div
                tw="flex text-title"
                style={{
                  wordBreak: "break-word",
                  textWrap: "wrap",
                  whiteSpace: "pre-wrap",
                }}
              >
                {/* Zero width whitespace to fix line wrap bug in satori with " #" */}
                {truncateString(artwork.title, 70).replace(" #", " #\u200B")}
              </div>
              <div tw="flex flex-row h-[136px] items-center" style={{ gap: "128px" }}>
                {/* This gap should be 32px, but for some reason satori is rendering as double */}
                <div tw="flex flex-row items-center" style={{ gap: "16px" }}>
                  {artist.imgSrc && <div tw="w-[112px] h-[112px]" />} {/* Create a hole for the user image*/}
                  <div tw="flex flex-col">
                    <div tw="text-caption text-content-secondary">Artist</div>
                    <div>{truncateString(artist.name, 15)}</div>
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
        size: { width: 1200, height: 1200 },
      },
      ...(artist.imgSrc
        ? [
            {
              type: "static",
              src: artist.imgSrc,
              size: { width: 112, height: 112 },
              position: { left: 32 * 2, top: (600 - 60 - 32) * 2 },
              borderRadius: 999,
              animated: false,
            } as ImageLayer,
          ]
        : []),
    ],
  });
}

export function errorImageResponse() {
  return generateImageResponse({
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    twConfig,
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: "/images/superrare/no-image.gif",
        size: { width: 140 * 2, height: 140 * 2 },
        position: { left: (300 - 140 / 2) * 2, top: 176 * 2 },
        animated: true,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-16 flex flex-col justify-center items-center text-content-primary text-body">
            Unable to fetch the image
          </div>
        ),
        size: { width: 1200, height: 100 },
        position: { left: 0, top: 372 * 2 },
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
          "64px",
          {
            lineHeight: "96px",
            letterSpacing: "0px",
          },
        ],
        body: [
          "56px",
          {
            lineHeight: "72px",
            letterSpacing: "1.2px",
          },
        ],
        caption: [
          "48px",
          {
            lineHeight: "64px",
            letterSpacing: "1.2px",
          },
        ],
      },
    },
  },
};
