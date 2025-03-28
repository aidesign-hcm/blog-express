import BlogTable from '@/components/Table/Blog';
import { Suspense } from "react";

export default function BlogPage() {
   const feature = "feature"
  return (
    <div className="content">
      <h1 className="text-2xl mb-4">Trang bài viết</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <BlogTable feature={feature} />
      </Suspense>
    </div>
  );
}
