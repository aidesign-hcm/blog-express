"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import categoryApiRequest from "@/apiRequests/category";
import TreeComponent from "@/components/Widget/sortableTree";
import {
  MenuResType,
  MenuRes,
  MenuMainRes,
} from "@/schemaValidations/common.schema";
import pageApiRequest from "@/apiRequests/page";

interface ListItem extends z.infer<typeof MenuRes> {}
// Define main structure
interface OnMain {
  title: string;
  position: "0";
  _id: string;
}
type MenuResValues = z.infer<typeof MenuRes>;
type MenuMainResValues = z.infer<typeof MenuMainRes>;

type AddFormProps = {
  getList: MenuResValues;
  getMain: MenuMainResValues;
  handleSubmit: (data: any) => Promise<void>; // Submit handler
};
export default function DraggableList({
  handleSubmit,
  getList,
  getMain,
}: AddFormProps) {
  const [onMain, setOnMain] = useState<OnMain>({
    title: "",
    position: "0",
    _id: "",
  });
  const [onList, setOnList] = useState<ListItem[]>([]);

  useEffect(() => {
    if (getMain && Object.keys(getMain).length > 0) {
      setOnMain(getMain);
    }
  
    if (Array.isArray(getList)) {
      setOnList(getList);
    } else {
      setOnList([]); // Default to an empty array if getList is not an array
    }
  }, [getList, getMain]);
  
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<ListItem>({
    _id: "",
    name: "",
    slug: "",
    tasks: [],
    id: 0,
    droppable: true,
    parent: 0,
    text: "",
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resCategories = await categoryApiRequest.fetchAllCategories();
        if (resCategories.payload.success) {
          setCategories(resCategories.payload.categories); // Populate the categories
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPages= async () => {
      try {
        const res = await pageApiRequest.fetchAllPages();
        if (res.payload.success) {
          setPages(res.payload.pages); // Populate the categories
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  // Handle checkbox selection
  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePageChange = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  // Add selected categories to onList
  const addSelectedCategories = () => {
    const maxId =
      onList.length > 0 ? Math.max(...onList.map((item) => item.id)) : -1;
    const selectedItems = categories
      .filter((cat) => selectedCategories.includes(cat._id))
      .map((cat, index) => ({
        _id: cat._id, // Keep original _id
        name: cat.name,
        text: cat.name,
        slug: cat.slug,
        tasks: [],
        id: maxId + 2 + index, // Assign the next available ID sequentially
        droppable: true,
        parent: 0,
      }));
    setOnList((prevList) => [...prevList, ...selectedItems]); // Add at the beginning
    setSelectedCategories([]); 
  };


  const addSelectedPages = () => {
    const maxId =
      onList.length > 0 ? Math.max(...onList.map((item) => item.id)) : -1;
    const selectedItems =  pages
      .filter((page) => selectedPages.includes(page._id))
      .map((page, index) => ({
        _id: page._id, // Keep original _id
        name: page.title,
        text: page.title,
        slug:  'page/' + page.slug,
        tasks: [],
        id: maxId + 2 + index, // Assign the next available ID sequentially
        droppable: true,
        parent: 0,
      }));
    setOnList((prevList) => [...prevList, ...selectedItems]); // Add at the beginning
    setSelectedPages([]); 
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleInputmenuChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setOnMain({ ...onMain, [e.target.name]: e.target.value });
  };
  // Add a new item with validation
  const addNewItem = () => {
    const maxId =
      onList.length > 0 ? Math.max(...onList.map((item) => item.id)) : -1;
    const newId = maxId + 2; // Get the next available ID

    const parsedItem = MenuRes.safeParse({
      ...newItem,
      text: newItem.name, // Set text to be the same as name
      _id: `${Date.now()}`, // Unique identifier
      id: newId, // Incremental index
    });

    if (!parsedItem.success) {
      setError(parsedItem.error.errors[0].message);
      return;
    }

    setOnList((prevList) => [...prevList, parsedItem.data ]); // Add at the beginning
    setNewItem({
      _id: "",
      name: "",
      text: "",
      slug: "",
      tasks: [],
      id: 0,
      droppable: true,
      parent: 0,
    });
    setError(null);
  };

  return (
    <div className="flex space-x-4 px-12">
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Các Mục menu</h2>
        <div className="mb-4 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Liên Kết tự tạo</h2>
          <input
            type="text"
            name="name"
            placeholder="Tên Đường Dẫn"
            value={newItem.name}
            onChange={handleInputChange}
            className="input input-sm input-bordered w-full rounded-md mb-2"
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={newItem.slug}
            onChange={handleInputChange}
            className="input input-sm input-bordered w-full rounded-md mb-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={addNewItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Thêm
          </button>
        </div>
        <div className="w-full">
          <div className="mb-4 border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Chọn Danh Mục</h2>
            <div className=" max-h-80 overflow-scroll">
              {categories.map((category) => (
                <label key={category._id} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCheckboxChange(category._id)}
                    className="mr-2"
                  />
                  {category.name}
                </label>
              ))}
            </div>
            <button
              onClick={addSelectedCategories}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm danh mục đã chọn
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-4 border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Chọn trang</h2>
            <div className=" max-h-80 overflow-scroll">
              {pages.map((page) => (
                <label key={page._id} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page._id)}
                    onChange={() => handlePageChange(page._id)}
                    className="mr-2"
                  />
                  {page.title}
                </label>
              ))}
            </div>
            <button
              onClick={addSelectedPages}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm Trang đã chọn
            </button>
          </div>
        </div>
      </div>

      {/* List of items with draggable tasks */}
      <div className="w-full md:w-2/3 max-h-screen overflow-scroll">
        <div className="bg-gray-100 border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // ✅ Prevent page reload
              handleSubmit({ onList, onMain }); // ✅ Pass data to parent function
            }}
          >
            <div className="border p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Thông tin menu</h2>
              <label className="block mb-2">
                Title:
                <input
                  type="text"
                  name="title"
                  value={onMain.title}
                  onChange={handleInputmenuChange}
                  className="input input-sm input-bordered w-full rounded-md mb-2"
                  required
                />
              </label>

              {/* Position Select */}
              <label className="block mb-2">
                Position:
                <select
                  name="position"
                  value={onMain.position}
                  onChange={handleInputmenuChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="0">Main menu</option>
                  <option value="1">Footer 1</option>
                  <option value="2">Footer 2</option>
                  <option value="3">Footer 3</option>
                  <option value="4">Footer 4</option>
                  <option value="5">Footer 5</option>
                  <option value="6">Footer 6</option>
                  <option value="7">Footer 7</option>
                  <option value="8">Không Sử dụng</option>
                </select>
              </label>
            </div>
            <div className="border p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Cấu trúc Menu</h2>
              <TreeComponent treeData={onList} setTreeData={setOnList} />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
