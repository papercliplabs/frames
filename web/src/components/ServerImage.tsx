import { ImageProps, getImageProps } from "next/image";

export default function ServerImage(props: ImageProps) {
  const nextImage = getImageProps(props);
  return <img {...nextImage.props} src={`${process.env.NEXT_PUBLIC_URL}${nextImage.props.src}`} />;
}
