import { FrameButtonInfo } from "@/utils/metadata";
import { CarouselConfig } from "./configs";

type FrameButtonInfoWithAction = FrameButtonInfo & { carouselAction: "prev" | "next" | "redirect" | "compose" };

export function getButtonInfoWithActionForCarouselItem(
    config: CarouselConfig,
    itemNumber: number,
    completionComposeLabelOverride?: string
): [FrameButtonInfoWithAction?, FrameButtonInfoWithAction?, FrameButtonInfoWithAction?, FrameButtonInfoWithAction?] {
    const frameButtons: [
        FrameButtonInfoWithAction?,
        FrameButtonInfoWithAction?,
        FrameButtonInfoWithAction?,
        FrameButtonInfoWithAction?
    ] = [];

    const configItem = config.itemConfigs[itemNumber];

    if (!configItem) {
        console.error("getButtonInfoForCarouselItem - index out of bounds, ", itemNumber);
        return [];
    }

    if (
        !config.navButtonConfig.disablePrevNavigation &&
        !configItem.navButtonConfigOverrides?.disablePrevNavigation &&
        itemNumber != 0
    ) {
        // Prev
        frameButtons.push({
            action: "post",
            title:
                configItem.navButtonConfigOverrides?.prevButtonLabel ?? config.navButtonConfig.prevButtonLabel ?? "<-",
            carouselAction: "prev",
        });
    }

    if (itemNumber != config.itemConfigs.length - 1) {
        // Next
        frameButtons.push({
            action: "post",
            title:
                configItem.navButtonConfigOverrides?.nextButtonLabel ?? config.navButtonConfig.nextButtonLabel ?? "->",
            carouselAction: "next",
        });
    }

    if (configItem.redirectButtonConfig != undefined) {
        frameButtons.push({
            action: "link",
            title: configItem.redirectButtonConfig.label,
            redirectUrl: configItem.redirectButtonConfig.url,
            carouselAction: "redirect",
        });
    }

    const lastItem = itemNumber == config.itemConfigs.length - 1;
    if (configItem.composeButtonConfig != undefined || (lastItem && completionComposeLabelOverride != undefined)) {
        const title = lastItem
            ? completionComposeLabelOverride ?? configItem.composeButtonConfig!.label
            : configItem.composeButtonConfig!.label;
        frameButtons.push({
            action: "post",
            title: title,
            carouselAction: "compose",
        });
    }

    return frameButtons;
}
