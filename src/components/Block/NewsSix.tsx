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

const NewsSix: React.FC<NewsFourProps> = ({ blogs, category }) => {


  return (
    <div className="col-span-1 row-span-2">
   {category?.slug && (
        <CategoryTitle category={category} />
      )}
    <div className="grid grid-cols-1 gap-4">
      {blogs.map((item, index) => (
        <div key={item._id} className="block border-t mt-2 pt-2 border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            <div className="box-text col-span-2">
            <Link href={"blog/" + item.slug}>
              <h2 className="text-md font-semibold mb-2">{item.title}</h2>
              </Link>
            </div>
            <div className="single-post-thumbnail">
            <Link href={"blog/" + item.slug}>
              <RenderImage img_url={item.featureImg.path} title={item.title} categories={item.categories} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default NewsSix;
