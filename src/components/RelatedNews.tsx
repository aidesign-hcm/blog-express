// components/RelatedPosts.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Post {
  id: number;
  title: { rendered: string };
  slug: string;
  featured_image?: string;
  featured_image_alt: string;
  featured_image_url?: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const renderImage = (post: Post, index: number) => {
   
    return (
      <div className="relative w-full premium-blog-thumbnail">
        <Image
          src={post.featured_image|| "/none.gif"}
          alt={
            post.featured_image_alt
              ? post.featured_image_alt
              : post.title.rendered
          }
          width={200}
          height={200}
          priority={index < 6} 
          loading={index < 6 ? "eager" : "lazy"}
          className="w-full"
          quality={50}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 my-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="relative hover:shadow-md"
        >
          <Link href={`/news/${post.slug}`}>
            {renderImage(post, index)}
          </Link>
          <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-1 py-4 z-10">
          <Link href={`/news/${post.slug}`}>
              <h2
                className="item-title text-xl text-white text-center"
                dangerouslySetInnerHTML={{
                  __html: post.title.rendered,
                }}
              />
              </Link>
            </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedPosts;
