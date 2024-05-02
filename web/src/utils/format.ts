/**
 * Format a number so it can nicely be rendered
 * @param num the number to be formatted, this can be a number or a string representation of a number. It should be less than 1 quintillion (10^15)
 * @param decimals the number of decimals to keep after formatting, if not specified it will keep 2
 * @param trimTrailingZeros if the number should have trailing zeros trimmed
 * @returns nicely formatted number, for example if number is 11023 this will return 1.10K
 */
export function formatNumber(num: number | string | undefined, decimals: number = 2, prefix: string = ""): string {
  const suffixes = ["", "", "M", "B", "T"];

  let formattedNum = num;

  if (formattedNum == undefined || isNaN(Number(num))) {
    return "--";
  }

  // If it is represented as a sting, convert to number first
  if (typeof formattedNum === "string") {
    formattedNum = parseFloat(formattedNum);

    if (isNaN(formattedNum)) {
      return num as string; // It isn't a number
    }
  }

  let suffixIndex = Math.floor((formattedNum.toFixed(0).toString().length - 1) / 3);

  // Clamp to max suffix
  if (suffixIndex >= suffixes.length) {
    suffixIndex = 0;
  }

  // Don't format below 1M
  if (formattedNum > 1e6) {
    formattedNum /= 10 ** (3 * suffixIndex);
  }

  if (formattedNum < 10 ** -decimals && formattedNum > 0) {
    formattedNum = "<" + prefix + (10 ** -decimals).toFixed(decimals);
  } else {
    let nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals });
    formattedNum = prefix + nf.format(formattedNum);
  }

  return formattedNum + suffixes[suffixIndex];
}

export function truncateString(input: string, charLimit: number): string {
  return input.length > charLimit - 3 ? input.slice(0, charLimit - 3) + "..." : input;
}

export function formatTimeLeft(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hoursString = hours > 0 ? hours.toString() + "h " : "";
  const minsString = mins > 0 ? mins.toString() + "m " : "";
  const secsString = secs + "s";

  return hoursString + minsString + secsString;
}
