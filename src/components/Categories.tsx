// components/Categories.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  category_image_url?: string;
  description: string;
  acf: object,
}

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const renderCatImage = (category: Category) => (
    <Image
      src={category.category_image_url || "/imagenotavailable.png"}
      alt={category.description || "Image not available"}
      width={60}
      height={60}
      priority={false}
      loading="lazy"
      blurDataURL="/none.gif"
      quality={40}
      placeholder="blur"
    />
  );
  

  return (
    <div className="w-full caterotry-block">
      <div className="game-list">
        <div className="grid grid-cols-2 gap-2 lg:gap-4 md:grid-cols-4 lg:grid-cols-6 overflow-hidden my-8">
          {categories.map((category) => (
            
            <div
              key={category.id}
              className="category-item bg-white rounded-lg shadow-md p-2 hover:shadow-lg"
            >
              <Link
                href={`/c/${category.slug}`}
                className="flex gap-4 items-center"
              >
                <div className="w-1/3">{renderCatImage(category)}</div>
                <h3 className="text-md w-2/3">{category.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
