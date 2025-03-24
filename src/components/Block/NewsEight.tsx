"use client";
import React from "react";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";
import envConfig from "@/config";

const NewsEight = ({ blogs = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {blogs.length > 0 ? (
        blogs.map((item) => (
          <div
            key={item._id}
            className="block border-t mt-2 pt-4 border-gray-200"
          >
            <div className="grid grid-cols-3 gap-2 content-start">
              <div className="single-post-thumbnail">
                <Link href={"/blog/" + item.slug}>
                  <RenderImage
                    img_url={item.featureImg?.path}
                    title={item.title}
                  />
                </Link>
              </div>
              <div className="box-text col-span-2">
                {item.categories.map((ite, idx) => (
                  <React.Fragment key={ite.slug}>
                    <Link
                      href={`${envConfig.NEXT_PUBLIC_URL}/${ite.slug}`}
                      className="text-indigo-600 hover:text-gray-700 transition duration-500 ease-in-out text-sm mr-1"
                    >
                      {ite.name}
                    </Link>
                    {item.categories.length > 1 &&
                      idx < item.categories.length - 1 && (
                        <span className="mr-1">-</span>
                      )}
                  </React.Fragment>
                ))}

                <Link
                  href={"/blog/" + item.slug}
                  className="text-md font-semibold"
                >
                  <h2 className="text-md font-semibold mb-2">{item.title}</h2>
                </Link>
                <p className="text-gray-600 line-clamp-3 short-text hidden md:block">
                  {item.short || "No description available"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No blog posts available.</p>
      )}
    </div>
  );
};

export default NewsEight;
