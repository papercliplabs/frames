"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REDIRECT_TIME_MS = 50;

interface RedirectPageProps {
    url: string;
}

export function RedirectPage({ url }: RedirectPageProps) {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Need a slight delay so Farcaster will pickup head metadata of whatever page this is on
            // router.replace(url);
        }, REDIRECT_TIME_MS);

        return () => clearTimeout(timeout);
    });

    return <>Redirecting to {url}</>;
}
