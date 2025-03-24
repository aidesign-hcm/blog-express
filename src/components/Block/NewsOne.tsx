"use client";
import RenderImage from "@/components/Widget/renderImage";
import Link from "next/link";
type Blog = {
  _id: string;
  slug: string;
  title: string;
  short?: string;
  featureImg?: { path: string };
};

interface NewsOneProps {
  blogs: Blog[];
}

const NewsOne: React.FC<NewsOneProps> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      {blogs.map((item, index) => {
        let colSpan = "col-span-1";
        let rowSpan = "row-span-1";
        let infocontent = null;

        if (index === 0) {
          colSpan = "col-span-3 grid grid-cols-1 md:grid-cols-5 gap-4";
          rowSpan = "row-span-2";
          infocontent = (
            <p key={`info-${item._id}`} className="text-gray-600">
              {item.short}
            </p>
          );
        }

        return (
          <div key={item._id || `news-${index}`} className={`${colSpan} ${rowSpan}`}>
            <div className="single-post-thumbnail col-span-3 mb-2">
              <Link href={"blog/" + item.slug}>
                <RenderImage img_url={item.featureImg.path} title={item.title} />
              </Link>
            </div>

            <div className="box-text col-span-2">
              <Link href={"blog/" + item.slug} className="text-md font-semibold line-clamp-2">
                {item.title}
              </Link>
              {infocontent}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsOne;
