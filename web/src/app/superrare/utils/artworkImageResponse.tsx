import ServerImage from "@/components/ServerImage";
import { truncateString } from "@/utils/format";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { ImageLayer } from "@/utils/generateImage/types";
import { localImageUrl } from "@/utils/urlHelpers";
import clsx from "clsx";

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

  imageCacheMaxAgeS?: number;
}

function artworkImageLayers({ artwork, artist, tag, extra }: ArtworkImageResponseParams): ImageLayer[] {
  return [
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
        <div tw="w-full h-full p-16 flex flex-col justify-between text-[#FFFFFF] text-[56px] leading-[72px] tracking-[1.2px]">
          {tag ? (
            <div
              tw={clsx(
                "flex px-6 py-2 rounded-[16px] border-[2px] items-center mr-auto ",
                tag.active ? "bg-white/90 text-black border-black/20" : "bg-[#191919]/90 border-white/20"
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
          <div tw="flex flex-col w-full" style={{ gap: "48px", textShadow: "0px 0px 2px rgba(0, 0, 0, 0.90)" }}>
            <div
              tw="flex text-[64px] leading-[96px] tracking-[0px]"
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
                  <div tw="text-[48px] leading-[64px] tracking-[1.2px] text-[#A0A0A0]">Artist</div>
                  <div>{truncateString(artist.name, 15)}</div>
                </div>
              </div>
              {extra && (
                <div tw="flex flex-col">
                  <div tw="text-[48px] leading-[64px] tracking-[1.2px] text-[#A0A0A0]">{extra.title}</div>
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
  ];
}

export function artworkImageResponse({ imageCacheMaxAgeS, ...params }: ArtworkImageResponseParams): Promise<Response> {
  return generateImageResponse({
    imageCacheMaxAgeS: imageCacheMaxAgeS ?? 60 * 30, // Every 30min by default
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    fontTypes: ["inter"],
    layers: artworkImageLayers(params),
  });
}

export function overlayedArtworkImageResponse({
  imageCacheMaxAgeS,
  overlaySrc,
  ...params
}: ArtworkImageResponseParams & { overlaySrc: string }): Promise<Response> {
  return generateImageResponse({
    imageCacheMaxAgeS: imageCacheMaxAgeS ?? 60 * 30, // Every 30min by default
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    fontTypes: ["inter"],
    layers: [...artworkImageLayers(params), { type: "static", size: { width: 1200, height: 1200 }, src: overlaySrc }],
  });
}

export function errorImageResponse() {
  return generateImageResponse({
    frameSize: {
      width: 1200,
      height: 1200,
    },
    imageCacheMaxAgeS: 60 * 60 * 6, // Every 6hr by default
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
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
          <div tw="w-full h-full p-16 flex flex-col justify-center items-center text-[#FFFFFF] text-[56px] leading-[72px] tracking-[1.2px]">
            Unable to fetch the image
          </div>
        ),
        size: { width: 1200, height: 100 },
        position: { left: 0, top: 372 * 2 },
      },
    ],
  });
}
