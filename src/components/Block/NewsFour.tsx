"use client";
import React, { useState, useEffect } from "react";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";
import envConfig from "@/config";

const NewsFour = ({ blogs = [] }) => {
  return (

    <div className="grid grid-cols-1 gap-4">
      {blogs.slice(0, 4).map((item, index) => {
        let colSpan = "col-span-1";
        let rowSpan = "row-span-1";
        let featuredImage = null;
        if (index === 0) {
          colSpan = "grid";
          featuredImage = (
            <div className="single-post-thumbnail col-span-1 mb-2">
              <Link href={"/blog/" + item.slug}>
                <RenderImage
                  img_url={item.featureImg?.path}
                  title={item.title}
                />
              </Link>
            </div>
          );
        }
        return (
          <div key={item._id} className={`${colSpan} ${rowSpan} border-b pb-2`}>
            {featuredImage}
            <div className="box-text">
              <Link
                href={"/blog/" + item.slug}
                className="text-md font-semibold"
              >
                <h2 className="text-md font-semibold">{item.title}</h2>
              </Link>
              <p className="text-gray-600 line-clamp-2">{item.short}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFour;
