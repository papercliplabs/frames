import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create a NounPoll",
  description: "NounPolls are Farcaster frame polls based on Noun voting weight.",
};

export default function NounPollLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
