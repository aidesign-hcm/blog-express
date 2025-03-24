import NewsOne from "@/components/Block/NewsOne";
import NewsTwo from "@/components/Block/NewsTwo";
import NewsThree from "@/components/Block/NewsThree";
import NewsFour from "@/components/Block/NewsFour";
import NewsFive from "@/components/Block/NewsFive";
import NewsSix from "@/components/Block/NewsSix";
import NewsSeven from "@/components/Block/NewsSeven";
import blogApiRequest from "@/apiRequests/blog";
import Link from "next/link";
import Ads from "@/components/Ads";

export default async function Home() {
  const resPost = await blogApiRequest.fetchBlogHome();
  const newBlogs = resPost?.payload?.newBlogs ?? [];
  const allPostPerCat = resPost?.payload?.allPostPerCat ?? [];


  return (
    <div className="container mx-auto py-4 px-4">
      <>
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 md:gap-8 mb-4">
          <div className="main-content col-span-3">
            <NewsOne blogs={newBlogs.slice(0, 4)} />
          </div>
          <div className="col-span-1">
            <Ads />
            {/* <NewsFour blogs={newBlogs.slice(4, 8)} /> */}
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 border-t pt-4">
          <div className="col-span-1 border-l-0 md:border-r pr-4">
            {allPostPerCat[0]?.posts && (
              <>
                <Link href={`/${allPostPerCat[0].slug}`}>
                  <h2 className="font-semibold text-lg border-b border-primary inline-block">
                    {allPostPerCat[0].name}
                  </h2>
                </Link>
                <NewsTwo blogs={allPostPerCat[0].posts} />
              </>
            )}
          </div>
          <div className="col-span-2">
            {allPostPerCat[1]?.posts && (
              <>
                <Link href={`/${allPostPerCat[1].slug}`}>
                  <h2 className="parent-cate font-semibold text-lg border-b border-primary inline-block">
                    {allPostPerCat[1].name}
                  </h2>
                </Link>
                <NewsThree blogs={allPostPerCat[1].posts} />
              </>
            )}

            {allPostPerCat[2]?.posts && (
              <div className="border-t pt-4 mt-4">
                <Link href={`/${allPostPerCat[2].slug}`}>
                  <h2 className="parent-cate font-semibold text-lg border-b border-primary inline-block">
                    {allPostPerCat[2].name}
                  </h2>
                </Link>
                <NewsThree blogs={allPostPerCat[2].posts} />
              </div>
            )}
            {allPostPerCat[3]?.posts && (
              <div className="border-t pt-4 mt-4">
                <Link href={`/${allPostPerCat[3].slug}`}>
                  <h2 className="parent-cate font-semibold text-lg border-b border-primary inline-block">
                    {allPostPerCat[3].name}
                  </h2>
                </Link>
                <NewsThree blogs={allPostPerCat[3].posts} />
              </div>
            )}
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 border-t pt-4">
          {allPostPerCat[4]?.posts && (
            <div className="mt-2">
              <Link href={`/${allPostPerCat[4].slug}`}>
                <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                  {allPostPerCat[4].name}
                </h2>
              </Link>
              <NewsFour blogs={allPostPerCat[4].posts} />
            </div>
          )}
          {allPostPerCat[5]?.posts && (
            <div className="mt-2">
              <Link href={`/${allPostPerCat[5].slug}`}>
                <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                  {allPostPerCat[5].name}
                </h2>
              </Link>
              <NewsFour blogs={allPostPerCat[5].posts} />
            </div>
          )}
          {allPostPerCat[6]?.posts && (
            <div className="mt-2">
              <Link href={`/${allPostPerCat[6].slug}`}>
                <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                  {allPostPerCat[6].name}
                </h2>
              </Link>
              <NewsFour blogs={allPostPerCat[6].posts} />
            </div>
          )}
        </div>

        {/* Section 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 mt-8 border-t pt-4">
          <div className="main-content col-span-2">
            {allPostPerCat[7]?.posts && (
              <>
                <div className="">
                  <div className="menu menu-horizontal gap-4 items-center">
                    <Link href={`/${allPostPerCat[7].slug}`}>
                      <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                        {allPostPerCat[7].name}
                      </h2>
                    </Link>
                  </div>
                </div>
                <NewsFive blogs={allPostPerCat[7].posts} />
              </>
            )}
          </div>
          <div className="col">
            {allPostPerCat[8]?.posts && (
              <>
                <div className="">
                  <div className="menu menu-horizontal gap-4 items-center">
                    <Link href={`/${allPostPerCat[8].slug}`}>
                      <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                        {allPostPerCat[8].name}
                      </h2>
                    </Link>
                  </div>
                </div>
                <NewsSix blogs={allPostPerCat[8].posts} />
              </>
            )}
          </div>
        </div>

        {/* Section 5 */}
        <div className="mt-8 bg-gray-100 px-2 relative">
          {allPostPerCat[9]?.posts && (
            <>
              <div className="">
                <div className="menu menu-horizontal gap-4 items-center">
                  <Link href={`/${allPostPerCat[9].slug}`}>
                    <h2 className="parent-cate font-semibold text-lg mb-2 border-b border-primary inline-block">
                      {allPostPerCat[9].name}
                    </h2>
                  </Link>
                </div>
              </div>
              <NewsSeven blogs={allPostPerCat[9].posts} />
            </>
          )}
        </div>
      </>
    </div>
  );
}
