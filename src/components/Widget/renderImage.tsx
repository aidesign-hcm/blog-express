import React, { useState } from "react";
import Image from "next/image";
import envConfig from "@/config";

interface RenderImageProps {
  img_url?: string;
  title: string;
}

const RenderImage: React.FC<RenderImageProps> = ({ img_url = "/imagenotavailable.png", title }) => {
  const baseUrl = envConfig?.NEXT_PUBLIC_API_ENDPOINT || "";
  const initialImageUrl = img_url.startsWith("http") ? img_url : `${baseUrl.replace(/\/$/, "")}/${img_url.replace(/^\//, "")}`;

  const [imageSrc, setImageSrc] = useState(initialImageUrl);

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageSrc === "/imagenotavailable.png" ? "Image not available" : title}
        fill
        className="object-cover"
        loading="lazy"
        onError={() => setImageSrc("/imagenotavailable.png")}
      />
    </div>
  );
};

export default RenderImage;
