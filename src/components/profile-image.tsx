import Image from "next/image";
import { twMerge } from "tailwind-merge";

type ProfileImageProps = {
  width?: number;
  height?: number;
  src: string;
  alt?: string;
  className?: string;
};

export const ProfileImage = ({
  width = 36,
  height = 36,
  src,
  alt = "",
  className = "",
}: ProfileImageProps) => (
  <Image
    width={width}
    height={height}
    src={src}
    alt={alt}
    className={twMerge("rounded-full", className)}
  />
);
