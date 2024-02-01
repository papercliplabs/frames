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
}

export default function MintConditionsNotMet({
    andConditions,
    orConditions,
}: MintConditionsNotMetParams): ReactElement {
    // TODO
    return (
        <div
            tw="flex flex-col w-full h-full justify-center items-center text-[24px]"
            style={{ backgroundColor: "white", color: "black" }}
        >
            Conditions Not Met!
            <div>AND conditions:</div>
            <ul>
                {andConditions.map((condition, i) => {
                    return (
                        <li key={i}>
                            {condition.name}: {condition.met ? "MET" : "NOT MET"}
                        </li>
                    );
                })}
            </ul>
            <div>OR conditions:</div>
            <ul tw="flex flex-col">
                {orConditions.map((condition, i) => {
                    return (
                        <li key={i}>
                            {condition.name}: {condition.met ? "MET" : "NOT MET"}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
