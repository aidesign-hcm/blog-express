"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';

interface Post {
  id: number;
  title: { rendered: string };
  slug: string;
  fimg_url?: string;
  featured_image?: string;
  featured_image_alt: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const StickydPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const renderImage = (post: Post, index: number) => {
    return (
      <div className="relative w-full h-full">
        {isLoading && <div className="skeleton object-cover opacity-70 h-full w-full absolute inset-0 animate-pulse"></div>}
        <Image
          src={post.fimg_url || "/none.gif"}
          alt={post.featured_image_alt || post.title.rendered}
          width={250}
          height={250}
          priority={index < 6} 
          loading={index < 6 ? "eager" : "lazy"}
          className="object-cover h-full w-full"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-10">
      {posts.map((post, index) => {
        let colSpan = "col-span-1 rounded-xl relative flex";
        let rowSpan = "row-span-1";
        if (index === 0 || index === 3 || index === 6) {
          colSpan = "col-span-2 rounded-xl relative flex ";
          rowSpan = "row-span-2";
        }
        return (
          <div key={post.id} className={`${colSpan} ${rowSpan}`}>
            <Link href={`/${post.slug}`} className="w-full">
              {renderImage(post, index)}
              <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-0">
                <h2
                  className="item-title"
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default StickydPosts;
