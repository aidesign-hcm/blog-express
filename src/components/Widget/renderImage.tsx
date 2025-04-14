import React, { useState } from "react";
import Image from "next/image";
import envConfig from "@/config";

interface Category {
  iconImg?: string;
}

interface RenderImageProps {
  img_url?: string;
  title: string;
  categories: Category[];
}

const RenderImage: React.FC<RenderImageProps> = ({
  img_url = "/imagenotavailable.png",
  title,
  categories,
}) => {
  const baseUrl = envConfig?.NEXT_PUBLIC_API_ENDPOINT || "";
  const initialImageUrl = img_url.startsWith("http")
    ? img_url
    : `${baseUrl.replace(/\/$/, "")}/${img_url.replace(/^\//, "")}`;

  const [imageSrc, setImageSrc] = useState(initialImageUrl);

  const categoryIcon = categories?.[0]?.iconImg;

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden">
      <Image
        src={imageSrc}
        alt={
          imageSrc === "/imagenotavailable.png" ? "Image not available" : title
        }
        fill
        className="object-cover"
        loading="lazy"
        onError={() => setImageSrc("/imagenotavailable.png")}
      />

      {categoryIcon && (
        <div className="absolute bottom-0 left-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center">
            <Image
              src={`${baseUrl}/${categoryIcon}`}
              alt={
                imageSrc === "/imagenotavailable.png" ? "Image not available" : title
              }
              width={20}
              height={20}
              onError={() => setImageSrc("/imagenotavailable.png")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderImage;
