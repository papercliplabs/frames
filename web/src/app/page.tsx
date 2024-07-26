import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center  bg-black p-4 text-center text-white">
      <div className="whitespace-pre-wrap">
        <Link href="https://paperclip.xyz" className="underline hover:brightness-75">
          Paperclip Labs
        </Link>{" "}
        frame server.
      </div>
    </div>
  );
}
