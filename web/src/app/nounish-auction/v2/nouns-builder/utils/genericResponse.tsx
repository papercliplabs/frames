import { NounsBuilderAuction } from "@/common/nounsBuilder/data/getCurrentAuction";
import { NounsBuilderToken } from "@/common/nounsBuilder/data/getToken";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { auctionDataLayer, paperclipLogoLayer, tokenBackgroundBlurLayer } from "./commonLayers";
import { FontType } from "@/utils/imageOptions";

export function genericResponseExtrude(style: {
  fontFamily: {
    title: FontType;
    body: FontType;
  };
  color: {
    content: { primary: string; secondary: string };
    background: string;
  };
}): (token: NounsBuilderToken, auction: NounsBuilderAuction) => Promise<Response> {
  return async (token: NounsBuilderToken, auction: NounsBuilderAuction) =>
    generateImageResponse({
      imageCacheMaxAgeS: 30,
      frameSize: { width: 1200, height: 1200 },
      backgroundColor: "#000000",
      fontTypes: [style.fontFamily.title, style.fontFamily.body],
      layers: [
        {
          type: "static",
          size: {
            width: 1200,
            height: 640,
          },
          extrude: {
            left: 300,
            right: 300,
            top: 40,
          },
          fit: "contain",
          src: token.imgSrc,
        },
        await auctionDataLayer(token, auction, style),
        paperclipLogoLayer,
      ],
    });
}

export function genericResponseBackgroundBlur(style: {
  fontFamily: {
    title: FontType;
    body: FontType;
  };
  color: {
    content: { primary: string; secondary: string };
    background: string;
  };
}): (token: NounsBuilderToken, auction: NounsBuilderAuction) => Promise<Response> {
  return async (token: NounsBuilderToken, auction: NounsBuilderAuction) =>
    generateImageResponse({
      imageCacheMaxAgeS: 30,
      frameSize: { width: 1200, height: 1200 },
      backgroundColor: "#000000",
      fontTypes: [style.fontFamily.title, style.fontFamily.body],
      layers: [
        await tokenBackgroundBlurLayer(token),
        {
          type: "static",
          size: {
            width: 560,
            height: 560,
          },
          position: {
            top: 40,
            left: 320,
          },
          borderRadius: 12,
          src: token.imgSrc,
        },
        await auctionDataLayer(token, auction, style),
        paperclipLogoLayer,
      ],
    });
}
