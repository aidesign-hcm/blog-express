import React, { useState } from "react";
import Image from "next/image";
import envConfig from "@/config";
import Link from "next/link";

interface Category {
  iconImg?: string;
  slug?: string;
  name?: string;
}

interface Props {
  category: Category;
}

const CategoryTitle: React.FC<Props> = ({ category }) => {
  const baseUrl = envConfig?.NEXT_PUBLIC_API_ENDPOINT || "";
  const [imgSrc, setImgSrc] = useState(`${baseUrl}/${category.iconImg}`);

  return (
    <>
    <Link href={`/${category.slug || ""}`} className="flex items-center mb-2">
    {category.iconImg && (
      <div className="mr-2">
        <Image
          src={imgSrc}
          alt={category.name || "Category"}
          width={20}
          height={20}
          onError={() => setImgSrc("/imagenotavailable.png")}
        />
      </div>)}
      <h2 className="parent-cate font-semibold text-lg border-b border-primary inline-block">
        {category.name}
      </h2>
    </Link>
    </>
  );
};

export default CategoryTitle;
