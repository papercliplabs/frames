import { CarouselConfig } from "./configs";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";

type FrameButtonInfoWithAction = FrameButtonMetadata & { carouselAction?: "prev" | "next" | "compose" };

export function getButtonsWithActionForCarouselItem(
  config: CarouselConfig,
  itemNumber: number
): [FrameButtonInfoWithAction, ...FrameButtonInfoWithAction[]] | undefined {
  const frameButtons: FrameButtonInfoWithAction[] = [];

  const configItem = config.itemConfigs[itemNumber];

  if (!configItem) {
    console.error("getButtonInfoForCarouselItem - index out of bounds, ", itemNumber);
    return undefined;
  }

  // Not the first page, and didn't disable back nav
  if (
    !config.navButtonConfig?.disablePrevNavigation &&
    !configItem.navButtonConfigOverrides?.disablePrevNavigation &&
    itemNumber != 0
  ) {
    // Prev
    frameButtons.push({
      action: "post",
      label: configItem.navButtonConfigOverrides?.prevButtonLabel ?? config.navButtonConfig?.prevButtonLabel ?? "⬅️",
      carouselAction: "prev",
    } as FrameButtonInfoWithAction);
  }

  // Not the last page
  if (itemNumber != config.itemConfigs.length - 1) {
    // Next
    frameButtons.push({
      action: "post",
      label: configItem.navButtonConfigOverrides?.nextButtonLabel ?? config.navButtonConfig?.nextButtonLabel ?? "➡️",
      carouselAction: "next",
    } as FrameButtonInfoWithAction);
  }

  if (configItem.buttonThreeConfig != undefined) {
    const isCompose = configItem.buttonThreeConfig.action == "compose";
    frameButtons.push({
      action: isCompose ? "post" : configItem.buttonThreeConfig.action,
      label: configItem.buttonThreeConfig.label,
      target: configItem.buttonThreeConfig.target + (isCompose ? "?composing=1" : ""),
      carouselAction: configItem.buttonThreeConfig.action == "compose" ? "compose" : undefined,
    } as FrameButtonInfoWithAction);
  }

  if (configItem.buttonFourConfig != undefined) {
    const isCompose = configItem.buttonFourConfig.action == "compose";
    frameButtons.push({
      action: configItem.buttonFourConfig.action == "compose" ? "post" : configItem.buttonFourConfig.action,
      label: configItem.buttonFourConfig.label,
      target: configItem.buttonFourConfig.target + (isCompose ? "?composing=1" : ""),
      carouselAction: configItem.buttonFourConfig.action == "compose" ? "compose" : undefined,
    } as FrameButtonInfoWithAction);
  }

  return frameButtons.length == 0
    ? undefined
    : (frameButtons as [FrameButtonInfoWithAction, ...FrameButtonInfoWithAction[]]);
}
