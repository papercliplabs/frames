import generateLayeredImage from "@/utils/generateLayeredImage";

export default async function Page() {
  return (
    <>
      <img src={await generateLayeredImage()} />
    </>
  );
}
