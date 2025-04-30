import NewsFour from "@/components/Block/NewsFour";
import pageApiRequest from "@/apiRequests/page";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import Ads from "@/components/Ads";
import PostShare from "@/components/Form/Share";
import BlogMeta from "@/components/Navigation/BlogMeta";
import ContentWrap from "@/components/Widget/ContentWrap";

// Cache the API request to avoid duplicate calls
const fetchpageData = cache(async (slug: string) => {
  console.log(slug);
  return pageApiRequest.fetchPageBySlug(slug);
});

interface pageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: pageProps): Promise<Metadata> {
  try {
    const slug = params.slug;
    const resPage = await fetchpageData(slug);
    if (!resPage || !resPage.payload?.page) {
      return { title: undefined }; // Uses Next.js default title
    }

    const page = resPage.payload.page;
    const title = page.title || undefined;
    const description =
      page.content || `Explore the latest news and updates in ${title}.`;
    const url = `${process.env.NEXT_PUBLIC_URL}/${page.slug}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "website",
      },
      twitter: {
        title,
        description,
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: undefined };
  }
}

export default async function Category({ params }: pageProps) {
  const slug = params.slug;
  try {
    const resPage = await fetchpageData(slug);
    if (!resPage || !resPage.payload || !resPage.payload.page) {
      notFound();
    }
    console.log(resPage);
    const newBlogs = resPage.payload.newBlogs ?? [];
    const page = resPage.payload.page;

    return (
      <div className="container mx-auto py-4 px-4 main-section">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4">
          <div className="main-content col-span-3">
            {page ? (
              <>
                <div className="content-wrap mb-4">
                  <div className="relative">
                    <div className="max-w-3xl mx-auto">
                      <div className="flex relative">
                        <div className="flex flex-col justify-between leading-normal w-full">
                          <div className="">
                            <h1 className="text-gray-900 font-bold text-4xl">
                              {page.title}
                            </h1>
                            <div className="content-wrapper overflow-x-hidden">
                              <ContentWrap
                                html={page.desc}
                                video={page.video}
                              />
                            </div>
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
         
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    notFound();
  }
}
