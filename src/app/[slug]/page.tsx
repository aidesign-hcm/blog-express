import NewsOne from "@/components/Block/NewsOne";
import NewsEight from "@/components/Block/NewsEight";
import NewsFour from "@/components/Block/NewsFour";
import blogApiRequest from "@/apiRequests/blog";
import PaginationCat from "@/components/Widget/PaginationCat";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import Ads from "@/components/Ads";

// Cache the API request to avoid duplicate calls
const fetchCategoryData = cache(
  async (slug: string, page: number, perPage: number) => {
    return blogApiRequest.fetchBlogByCategory(slug, { page, perPage });
  }
);

interface CategoryProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: CategoryProps): Promise<Metadata> {
  try {
    const slug = params.slug;
    const resPost = await fetchCategoryData(slug, 1, 1);

    if (!resPost || !resPost.payload?.catId) {
      return { title: undefined }; // Uses Next.js default title
    }

    const category = resPost.payload.catId;
    const title = category.name || undefined;
    const description =
      category.content || `Explore the latest news and updates in ${title}.`;
    const image = category.featureImg?.path || "/default-image.jpg";
    const url = `${process.env.NEXT_PUBLIC_URL}/${category.slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [{ url: image }],
        type: "website",
      },
      twitter: {
        title,
        description,
        images: [image],
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: undefined };
  }
}

export default async function Category({
  params,
  searchParams,
}: CategoryProps) {
  const page = Number(searchParams.page) || 1;
  const slug = params.slug;
  const perPage = 20;

  try {
    const resPost = await fetchCategoryData(slug, page, perPage);
    if (!resPost || !resPost.payload || resPost.payload.blogs.length === 0) {
      notFound();
    }

    const blogs = resPost.payload.blogs ?? [];
    const total = resPost.payload.total ?? 0;
    const newBlogs = resPost.payload.newBlogs ?? [];
    const category = resPost.payload.catId;

    return (
      <div className="container mx-auto py-4 px-4 main-section">
        <h2 className="text-lg font-semibold mb-4">
          Danh mục: {category.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4">
          <div className="main-content col-span-2">
            {blogs.length > 0 ? (
              <NewsOne blogs={blogs.slice(0, 4)} />
            ) : (
              <p>No posts found.</p>
            )}
            {blogs.length > 4 && <NewsEight blogs={blogs.slice(4, 10)} />}
            {blogs.length > 0 && (
              <PaginationCat page={page} perPage={perPage} total={total} />
            )}
          </div>
          <div className="ads col-span-1">
            <Ads />
            <h2 className="font-semibold text-lg">Tin Mới</h2>
            <NewsFour blogs={newBlogs.slice(4, 10)} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    notFound();
  }
}
