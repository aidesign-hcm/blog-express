import BlogTable from "@/components/Table/UserBlog";

export default async function BlogPage() {
  const rule = "manager"
  return (
    <div className="content">
      <h1 className="text-2xl mb-4">Blog Page</h1>
      <BlogTable rule={rule} />
    </div>
  );
}
