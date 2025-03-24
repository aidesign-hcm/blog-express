"use client";
import React, { useState, useEffect } from "react";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";

const NewsOne = ({ blogs }) => {
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {blogs.map((item, index) => (
        <div key={item._id} className="block border-t mt-2 pt-4 border-gray-200">
          <Link href={"blog/" + item.slug}><h2 className="text-md font-semibold mb-2">{item.title}</h2></Link>
          <div className="grid grid-cols-3 gap-2">
            <div className="single-post-thumbnail">
            <Link href={"blog/" + item.slug}>
              <RenderImage img_url={item.featureImg.path} title={item.title} />
              </Link>
            </div>
            <div className="box-text col-span-2">
            <p className='text-gray-600 line-clamp-3'>{item.short}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsOne;
