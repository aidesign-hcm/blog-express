import Link from "next/link";
import React from "react";

interface Category {
  slug: string;
  name: string;
}

interface BreadcrumbsProps {
  categories: Category[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categories }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul className="flex space-x-2">
        <li>
          <Link href="/">Trang chủ</Link>
        </li>
        {categories.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
