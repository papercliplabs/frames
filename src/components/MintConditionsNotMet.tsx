import { ReactElement } from "react";
import { Optional } from "@/utils/types";

interface MintConditionsNotMetParams {
    andConditions: {
        name: string;
        description: string;
        met: boolean;
    }[];
    orConditions: {
        name: string;
        description: string;
        met: boolean;
    }[];
    backgroundColor: string;
    fontColor: string;
    icon: string;
}

export default function MintConditionsNotMet({
    andConditions,
    orConditions,
    backgroundColor,
    fontColor,
    icon,
}: MintConditionsNotMetParams): ReactElement {
    const orMet = orConditions.reduce((acc, cond) => acc || cond.met, false);
    const andConditionsWithOr = [...andConditions, { name: "One of:", description: "", met: orMet }];
    return (
        <div
            tw="flex flex-row w-full h-full text-[52px] p-[64px]"
            style={{ backgroundColor: backgroundColor, color: fontColor }}
        >
            <span tw="text-[68px] w-[300px] mr-[64px]">Missing Conditions...</span>
            <span tw="flex flex-col w-[708px] pl-[64px]">
                <ul tw="flex flex-col">
                    {andConditionsWithOr.map((condition, i) => {
                        return (
                            <li key={i}>
                                {condition.met ? "🟢 " : "⚪️ "} {condition.name}
                            </li>
                        );
                    })}
                </ul>
                <ul tw="flex flex-col pl-[64px] text-[40px]">
                    {orConditions.map((condition, i) => {
                        return (
                            <li key={i}>
                                {condition.met ? "🟢 " : "⚪️ "} {condition.name}
                            </li>
                        );
                    })}
                </ul>
            </span>
            <img src={icon} style={{ position: "absolute", bottom: 0, left: 64, width: 300 }} />
        </div>
    );
}
