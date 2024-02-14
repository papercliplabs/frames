import { CarouselConfig } from "./configs";
import { FrameButtonMetadata } from "@coinbase/onchainkit";

type FrameButtonInfoWithAction = FrameButtonMetadata & { carouselAction: "prev" | "next" | "redirect" | "compose" };

export function getButtonsWithActionForCarouselItem(
    config: CarouselConfig,
    itemNumber: number,
    completionComposeLabelOverride?: string
): [FrameButtonInfoWithAction, ...FrameButtonInfoWithAction[]] | undefined {
    const frameButtons: FrameButtonInfoWithAction[] = [];

    const configItem = config.itemConfigs[itemNumber];

    if (!configItem) {
        console.error("getButtonInfoForCarouselItem - index out of bounds, ", itemNumber);
        return undefined;
    }

    if (
        !config.navButtonConfig?.disablePrevNavigation &&
        !configItem.navButtonConfigOverrides?.disablePrevNavigation &&
        itemNumber != 0
    ) {
        // Prev
        frameButtons.push({
            action: "post",
            label:
                configItem.navButtonConfigOverrides?.prevButtonLabel ?? config.navButtonConfig?.prevButtonLabel ?? "⬅️",
            carouselAction: "prev",
        } as FrameButtonInfoWithAction);
    }

    if (itemNumber != config.itemConfigs.length - 1) {
        // Next
        frameButtons.push({
            action: "post",
            label:
                configItem.navButtonConfigOverrides?.nextButtonLabel ?? config.navButtonConfig?.nextButtonLabel ?? "➡️",
            carouselAction: "next",
        } as FrameButtonInfoWithAction);
    }

    if (configItem.redirectButtonConfig != undefined) {
        frameButtons.push({
            action: "link",
            label: configItem.redirectButtonConfig.label,
            target: configItem.redirectButtonConfig.url,
            carouselAction: "redirect",
        } as FrameButtonInfoWithAction);
    }

    const lastItem = itemNumber == config.itemConfigs.length - 1;
    if (configItem.composeButtonConfig != undefined || (lastItem && completionComposeLabelOverride != undefined)) {
        const title = lastItem
            ? completionComposeLabelOverride ?? configItem.composeButtonConfig!.label
            : configItem.composeButtonConfig!.label;
        frameButtons.push({
            action: "post",
            label: title,
            carouselAction: "compose",
        } as FrameButtonInfoWithAction);
    }

    return frameButtons.length == 0
        ? undefined
        : (frameButtons as [FrameButtonInfoWithAction, ...FrameButtonInfoWithAction[]]);
}
