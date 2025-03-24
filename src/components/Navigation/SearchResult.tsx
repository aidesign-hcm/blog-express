"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export const Hit = ({ hit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const renderImage = (image: string) => {
      return (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="skeleton object-cover opacity-70 h-full w-full absolute inset-0 animate-pulse"></div>
          )}
          <Image
            src={image || "/none.gif"}
            width={100}
            height={100}
            priority={true}
            alt={""}
            onLoad={() => setIsLoading(false)}
            quality={50}
          />
        </div>
      );
    
  };
  return (
    <div className="card-blog rounded-xl relative overflow-hidden">
      <Link
        href={`/${hit.post_slug}`}
        onClick={() => {
          document.getElementById("my-drawer")?.click();
        }}
      >
        {renderImage(hit.images.thumbnail.url)}
        <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-0">
          <h2
            className="item-title"
            dangerouslySetInnerHTML={{
              __html: hit.post_title,
            }}
          />
        </div>
      </Link>
    </div>
  );
};

export const HitNav = ({ hit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const renderImage = (image: string) => {
      return (
        <div className="relative w-full h-full">
        {isLoading && (
          <div className="skeleton object-cover opacity-70 h-full w-full absolute inset-0 animate-pulse"></div>
        )}
        <Image
          src={image || "/none.gif"}
          width={100}
          height={100}
          priority={true}
          alt={""}
          onLoad={() => setIsLoading(false)}
          quality={50}
        />
      </div>
      );
    
  };
  return (
    <div className="card-blog rounded-xl relative">
      <Link href={`/${hit.post_slug}`}>
        {renderImage(hit.images.thumbnail.url)}
        <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-0">
          <h2
            className="item-title"
            dangerouslySetInnerHTML={{
              __html: hit.post_title,
            }}
          />
        </div>
      </Link>
    </div>
  );
};