import NewsEight from "@/components/Block/NewsEight";
import NewsFour from "@/components/Block/NewsFour";
import blogApiRequest from "@/apiRequests/blog";
import PaginationCat from "@/components/Widget/PaginationCat";
import { useRouter } from "next/router";
interface CategoryProps {
  params: { slug: string };
  searchParams: { page?: string; q?: string };
}

export default async function Search({ searchParams }: CategoryProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = 20;

  const query = searchParams.q || "";
  const data = { page, perPage, query };
  try {
    const resPost = await blogApiRequest.fetchBlogBySearch(data);
    const blogs = resPost?.payload?.blogs ?? [];
    const total = resPost?.payload?.total ?? 0;
    const newBlogs = resPost?.payload?.newBlogs ?? [];
    return (
      <>
        <div className="container mx-auto py-4 px-4 main-section"><h2 className="text-lg font-semibold mb-4">Từ khóa: { searchParams.q}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4">
            <div className="main-content col-span-2">
              {blogs.length > 0 ? (
                <>
                  <NewsEight blogs={blogs} />
                  <PaginationCat page={page} perPage={perPage} total={total} />
                </>
              ) : (
                <p>No posts found.</p>
              )}
            </div>
            <div className="ads col-span-1">
              <h2 className="font-semibold text-lg">Tin Mới</h2>
              <NewsFour blogs={newBlogs} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="container mx-auto py-4 px-4">
        <p>Failed to load posts. Please try again later.</p>
      </div>
    );
  }
}
