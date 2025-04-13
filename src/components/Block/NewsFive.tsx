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

const NewsFive: React.FC<NewsFourProps> = ({ blogs, category }) =>  {
  return (
    <div className="col-span-2 row-span-2">
     {category?.slug && (
        <Link href={`/${category.slug}`}>
          <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
            {category.name}
          </h2>
        </Link>
      )}
      <div className="border-t pt-2 mt-2">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
          {blogs.map((item, index) => {
            let colSpan = "col-span-1";
            let rowSpan = "row-span-1";
            let infocontent = null;
            if (index === 0) {
              colSpan = "col-span-2";
              rowSpan = "row-span-2";
              infocontent = <p className="text-gray-600">{item.short}</p>;
            } else if (index === 1 || index === 2) {
              colSpan = "col-span-1";
              rowSpan = "row-span-1";
            }
            return (
              <div key={item._id} className={`${colSpan} ${rowSpan}`}>
                <div className="single-post-thumbnail col-span-2 mb-2">
                  <Link href={"blog/" + item.slug}>
                    <RenderImage
                      img_url={item.featureImg.path}
                      title={item.title}
                      categories={item.categories}
                    />
                  </Link>
                </div>
                <div className="box-text">
                  <Link href={"blog/" + item.slug}>
                    <h2 className="text-md font-semibold">{item.title}</h2>
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

export default NewsFive;
