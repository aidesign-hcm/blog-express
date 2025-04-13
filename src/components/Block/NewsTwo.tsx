"use client";
import React, { useState, useEffect } from "react";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  short?: string;
  featureImg?: { path: string };
  categories?: any[]; // Update this if you have a specific shape for categories
};

type Category = {
  slug: string;
  name: string;
};

interface NewsFourProps {
  blogs: Blog[];
  category?: Category; // Optional
}

const NewsTwo: React.FC<NewsFourProps> = ({ blogs, category }) =>  {
  return (
    <div className="col-span-1 row-span-3 border-l-0 md:border-r pr-4">
      {category?.slug && (
        <Link href={`/${category.slug}`}>
          <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
            {category.name}
          </h2>
        </Link>
      )}
      <div className="grid grid-cols-1 gap-4">
        {blogs.map((item, index) => (
          <div
            key={item._id}
            className="block border-t mt-2 pt-4 border-gray-200"
          >
            <Link href={"blog/" + item.slug}>
              <h2 className="text-md font-semibold mb-2">{item.title}</h2>
            </Link>
            <div className="grid grid-cols-3 gap-2">
              <div className="single-post-thumbnail">
                <Link href={"blog/" + item.slug}>
                  <RenderImage
                    img_url={item.featureImg.path}
                    title={item.title}
                    categories={item.categories}
                  />
                </Link>
              </div>
              <div className="box-text col-span-2">
                <p className="text-gray-600 line-clamp-3">{item.short}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTwo;
