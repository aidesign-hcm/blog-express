"use client";
import React from "react";
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

const NewsFour: React.FC<NewsFourProps> = ({ blogs, category }) => {
  return (
    <div className="col-span-1 row-span-2 border-l-0 md:border-r pr-4">
   {category?.slug && (
        <CategoryTitle category={category} />
      )}

      <div className="grid grid-cols-1 gap-4">
        {blogs?.slice(0, 4).map((item, index) => {
          const colSpan = index === 0 ? "grid" : "col-span-1";
          const rowSpan = "row-span-1";

          const featuredImage =
            index === 0 ? (
              <div className="single-post-thumbnail col-span-1 mb-2">
                <Link href={`/blog/${item.slug}`}>
                  <RenderImage
                    img_url={item.featureImg?.path}
                    title={item.title}
                    categories={item.categories}
                  />
                </Link>
              </div>
            ) : null;

          return (
            <div key={item._id} className={`${colSpan} ${rowSpan} border-b pb-2`}>
              {featuredImage}
              <div className="box-text">
                <Link href={`/blog/${item.slug}`} className="text-md font-semibold">
                  <h2 className="text-md font-semibold">{item.title}</h2>
                </Link>
                <p className="text-gray-600 line-clamp-2">{item.short}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFour;
