// components/RelatedPosts.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  featured_image_alt: string;
  fimg_url: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const ShowPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const renderImage = (post: Post, index: number) => {
    
    return (
      <div className="relative w-full h-full">
        {isLoading && <div className="skeleton object-cover opacity-70 h-full w-full absolute inset-0 animate-pulse"></div>}
        <Image
          src={post.fimg_url || "/none.gif"}
          alt={post.featured_image_alt ? post.featured_image_alt : post.title}
          width={100}
          height={100}
          priority={index < 6} 
          loading={index < 6 ? "eager" : "lazy"}
          className="object-cover h-full w-full"
          onLoad={() => setIsLoading(false)}
          quality={50}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 md:grid-cols-8 lg:grid-cols-10 overflow-hidden my-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="card-blog rounded-xl relative overflow-hidden"
        >
          <Link href={`/${post.slug}`}>
            {renderImage(post, index)}
            <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-0">
              <h2
                className="item-title"
                dangerouslySetInnerHTML={{
                  __html: post.title,
                }}
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ShowPosts;
