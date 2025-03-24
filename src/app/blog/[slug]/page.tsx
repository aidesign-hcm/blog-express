import NewsEight from "@/components/Block/NewsEight";
import blogApiRequest from "@/apiRequests/blog";
import Link from "next/link";
import envConfig from "@/config";
import React from "react";
import PostShare from "@/components/Form/Share";
import { Metadata } from "next";
import FileWrap from "@/components/Widget/FileWrap";
import Breadcrumbs from "@/components/Navigation/Breadcrumbs";

import BlogMeta from "@/components/Navigation/BlogMeta";
import Ads from "@/components/Ads";
import ExcelViewer from "@/components/Widget/ExcelViewer";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const resPost = await blogApiRequest.fetchBlogBySlug(params.slug);
    const blog = resPost?.payload?.blog ?? null;

    if (!blog) {
      return {
        title: "Blog Not Found",
        description: "This blog post does not exist.",
      };
    }

    const baseUrl = envConfig.NEXT_PUBLIC_URL;
    const featureImageUrl = blog.featureImg?.path
      ? `${baseUrl}/${blog.featureImg.path}`
      : `${baseUrl}/default-image.jpg`;

    return {
      title: blog.title,
      description:
        blog.short ?? blog.desc.replace(/<[^>]*>?/gm, "").slice(0, 160),
      openGraph: {
        title: blog.title,
        description:
          blog.short ?? blog.desc.replace(/<[^>]*>?/gm, "").slice(0, 160),
        url: `${baseUrl}/blog/${blog.slug}`,
        siteName: "Your Site Name",
        images: [
          { url: featureImageUrl, width: 1200, height: 630, alt: blog.title },
        ],
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: ["Your Author Name"],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description:
          blog.short ?? blog.desc.replace(/<[^>]*>?/gm, "").slice(0, 160),
        images: [featureImageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Error loading blog",
      description: "An error occurred while fetching this blog post.",
    };
  }
}

export default async function Blog({ params }: { params: { slug: string } }) {
   
  const slug = params.slug;
  try {
    const resPost = await blogApiRequest.fetchBlogBySlug(slug);
    const blog = resPost?.payload?.blog ?? ""; // Ensure blogs is always an array
    const blogs = resPost?.payload?.blogs ?? [];
    const newBlogs = resPost?.payload?.newBlogs ?? [];

    return (
      <>
        <div className="first-block">
          <div className="container mx-auto py-4 px-4 main-section">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4 relative">
              <div className="main-content col-span-2">
                {blog ? (
                  <>
                    <div className="content-wrap mb-4">
                      <div className="relative">
                        <div className="max-w-3xl mx-auto">
                        <Breadcrumbs categories={blog.categories} />
                          <div className="flex relative">
                            <div className="hidden md:block mr-4">
                              <PostShare />
                            </div>
                            <div className="flex flex-col justify-between leading-normal w-full">
                              <div className="">
                                <h1 className="text-gray-900 font-bold text-4xl">
                                  {blog.title}
                                </h1>
                                <div className="md:hidden block">
                                  <PostShare />
                                </div>
                                <BlogMeta createdAt={blog.createdAt} authorUsername={blog.user.username} />
                                <div className="content-wrapper overflow-x-hidden">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: blog.desc,
                                    }}
                                  />
                                </div>
                               
                                <FileWrap blog={blog} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>No posts found.</p>
                )}
              </div>
              <div className="sidebar col-span-1">
                <div className="sticky top-12">
                <Ads />
                  <h2 className="font-semibold text-lg">Tin Mới mới</h2>
                  {newBlogs.length > 0 && <NewsEight blogs={newBlogs} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="second-block">
          <div className="container mx-auto py-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4">
              <div className="col-span-2">
                <h2 className="font-semibold text-lg">
                  <Link
                    href={`${envConfig.NEXT_PUBLIC_URL}/${blog.categories[0].slug}`}
                  >
                    {blog.categories[0].name}
                  </Link>
                </h2>
                {blogs.length > 0 && <NewsEight blogs={blogs} />}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p>Failed to load post. Please try again later.</p>
      </div>
    );
  }
}
