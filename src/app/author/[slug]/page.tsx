import NewsEight from "@/components/Block/NewsEight";
import NewsFour from "@/components/Block/NewsFour";
import blogApiRequest from "@/apiRequests/blog";
import PaginationCat from "@/components/Widget/PaginationCat";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

interface CategoryProps {
  params: { slug: string };
  searchParams: { page?: string };
}


export default async function Category({ params, searchParams }: CategoryProps) {

  const page = Number(searchParams.page) || 1;
  const slug = params.slug;
  const perPage = 20;
  const data = { page, perPage };
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  try {
    const resPost = await blogApiRequest.fetchBlogByAuthor(slug, data, sessionToken?.value ?? "");
    if (!resPost || !resPost.payload) {
      throw new Error("Invalid API response");
    }
    if (!resPost || !resPost.payload || resPost.payload.blogs.length === 0) {
      notFound();
    }
    const blogs = resPost.payload.blogs ?? [];
    const total = resPost.payload.total ?? 0;
    const newBlogs = resPost.payload.newBlogs ?? [];
    const author =  resPost.payload.userId ?? {}

    return (
      <div className="container mx-auto py-4 px-4 main-section">
        <h2 className="text-lg font-semibold">Tác giả: {author.username }</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 md:gap-8 mb-4">
          <div className="main-content col-span-2">
            {blogs.length > 0 && <NewsEight blogs={blogs} />}
            {blogs.length > 0 && <PaginationCat page={page} perPage={perPage} total={total} />}
          </div>
          <div className="ads col-span-1">
            <h2 className="font-semibold text-lg">Tin Mới</h2>
            <NewsFour blogs={newBlogs} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    notFound(); // Redirect to 404 page if an error occurs
  }
}
