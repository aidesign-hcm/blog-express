"use client";
import React, { useState, useEffect } from "react";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";
import CategoryTitle from "@/components/Widget/CategoryTitle";

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

const NewsThree: React.FC<NewsFourProps> = ({ blogs, category }) => {
  

  return (
    <div className="col-span-2 row-span-1">
   {category?.slug && (
        <CategoryTitle category={category} />
      )}
    <div className="border-t pt-2 mt-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
        {blogs.map((item, index) => {
          let colSpan = "col-span-1";
          let infocontent = null;
          let featuredImage = null;
          let firstCol = ''
          let elesCol = ''

          if (index === 0) {
            colSpan = "md:col-span-2 col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4";
            infocontent = <p className="text-gray-600">{item.short}</p>;
            featuredImage = (
              <div className="single-post-thumbnail col-span-1 mb-2">
                <RenderImage
                  img_url={item.featureImg.path}
                  title={item.title}
                  categories={item.categories}
                />
              </div>
            );
            firstCol = 'border-r border-gray-200 pr-4'
          } else if (index === 1) {
            infocontent = <p className="text-gray-600">{item.short}</p>;
          } else {
            elesCol = "list-post relative ml-2"
          }
          return (
            <div key={item._id} className={`${colSpan}  ${firstCol} ${elesCol}`}>
                <Link href={"blog/" + item.slug}>{featuredImage}</Link>
              <div className="box-text">
              <Link href={"blog/" + item.slug}>
                <h2 className="text-md font-semibold line-clamp-2">{item.title}</h2>
                </Link>
                {infocontent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default NewsThree;
