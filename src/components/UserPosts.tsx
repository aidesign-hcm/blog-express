// components/RelatedPosts.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  slug: string;
  fimg_url?: string;
  featured_image?: string;
  featured_image_alt: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const UserPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const renderImage = (post: Post) => (
    <Image
      src={post.fimg_url || "/none.gif"}
      alt={post.featured_image_alt ? post.featured_image_alt : post.title}
      className="object-cover h-full w-full"
      width={100}
      height={100}
    />
  );

  return (
    <div className="grid grid-cols-3 gap-4 lg:gap-6 md:grid-cols-4 lg:grid-cols-6 overflow-hidden my-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="card-blog rounded-xl relative overflow-hidden"
        >
          <Link href={`/${post.slug}`}>
            {renderImage(post)}
            <div className="item-title-wrap absolute bottom-0 left-0 right-0 opacity-0">
              <h2
                className="item-title"
                dangerouslySetInnerHTML={{
                  __html: post.title,
                }}
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
