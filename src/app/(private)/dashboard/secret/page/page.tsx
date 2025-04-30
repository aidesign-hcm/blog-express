import PageTable from '@/components/Table/Page';
import { Suspense } from "react";

export default function PagePage() {
  const feature = ""
  return (
    <div className="content">
      <h1 className="text-2xl mb-4">Trang bài viết</h1>
      <Suspense fallback={<div>Loading...</div>}>
      <PageTable feature={feature} />
      </Suspense>
    </div>
  );
}
