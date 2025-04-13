import NewsOne from "@/components/Block/NewsOne";
import NewsTwo from "@/components/Block/NewsTwo";
import NewsThree from "@/components/Block/NewsThree";
import NewsFour from "@/components/Block/NewsFour";
import NewsFive from "@/components/Block/NewsFive";
import NewsSix from "@/components/Block/NewsSix";
import NewsSeven from "@/components/Block/NewsSeven";
import blogApiRequest from "@/apiRequests/blog";
import Ads from "@/components/Ads";

const componentMap: Record<number, React.ComponentType<any>> = {
  1: NewsOne,
  2: NewsTwo,
  3: NewsThree,
  4: NewsFour,
  5: NewsFive,
  6: NewsSix,
  7: NewsSeven,
};

export default async function Home() {
  const resPost = await blogApiRequest.fetchBlogHome();
  const allPostPerCat = resPost?.payload?.allPostPerCat ?? [];
  const newBlogs = resPost?.payload?.newBlogs ?? [];

  return (
    <div className="container mx-auto py-4 px-4">
            <div className="grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 md:gap-8 mb-4">
                <div className="main-content col-span-3">
                  <NewsOne blogs={newBlogs.slice(0, 4)} />
                </div>
                <div className="col-span-1">
                  <Ads />
                </div>
              </div>
      <div className="grid auto-rows-auto grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t pt-4">
        {allPostPerCat.map((cat, index) => {
          if (!cat?.posts || !cat.block) return null;

          const BlogComponent = componentMap[cat.block];
          if (!BlogComponent) return null;
          let blogsSlice = cat.posts;
          switch (cat.block) {
            case 1:
            case 2:
              blogsSlice = cat.posts.slice(0, 7);
              break;
            case 3:
              blogsSlice = cat.posts.slice(0, 8);
              break;
            case 4:
              blogsSlice = cat.posts.slice(0, 4 + index);
              break;
            case 5:
              blogsSlice = cat.posts.slice(0, 3);
              break;
            case 6:
              blogsSlice = cat.posts.slice(0, 4);
              break;
            case 7:
              blogsSlice = cat.posts; // Full array
              break;
            default:
              blogsSlice = cat.posts;
          }

          return (
            <BlogComponent
              key={index}
              blogs={blogsSlice}
              category={cat}
            />
          );
        })}
      </div>
    </div>
  );
}
