"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { CategoryRes, CategoryCreate } from "@/schemaValidations/category.schema"; // Import the schema
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { generateSlugFromName } from "@/utils/slugGenerator";
import FileUpload from "@/components/FileUpload";
import mediaApiRequest from "@/apiRequests/media";
import categoryApiRequest from "@/apiRequests/category";

// Correct the type for categories
type CategoryFormValues = z.infer<typeof CategoryCreate>[0];

type AddFormProps = {
  category?: CategoryFormValues; // Pre-filled data for "edit" mode
  onSubmit: (data: CategoryFormValues) => Promise<void>; // Submit handler
};

const AddForm = ({ category, onSubmit }: AddFormProps) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryCreate.element), // Use schema for validation
    defaultValues: category || {
      _id: "",
      name: "",
      featureImg: {
        path: "",
        folder: "",
        _id: "",
      }, // Initialize featureImg as an object
      slug: "",
      content: "",
      index: 0,
      isFeature: false,
      isDefault: false,
      parent: null,
      ancestors: [],
      
    },
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

  const { watch, setValue } = form;
  const nameValue = watch("name");
  const handleGenerateSlug = () => {
    if (!nameValue) {
      toast.error("Please enter a name to generate the slug.");
      return;
    }
    const slug = generateSlugFromName(nameValue);
    setValue("slug", slug);
  };

  const handleFileSelected = (fileData: {
    imageFile: File;
    imageURL: string;
  }) => {
    // form.setValue("featureImg", fileData.imageURL);
  };

  const onUploadFeatureImg = async (imageFile: File) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append("imageFile", imageFile);
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await mediaApiRequest.postMedia(data, sessionToken);
      if (result) {
        toast.success(
          "Đăng hình ảnh thành công."
        );
        setTimeout(() => {
          form.setValue("featureImg", result.payload.featureImg);
        }, 3000);
      }
    } catch (error: any) {
      toast.error(
        "An error occurred during update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const onDeleteFeatureImg = () => {
    form.setValue("featureImg", {
      path: "",
      folder: "",
      _id: "",
    });
  };
  

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Tiêu đề" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 justify-between">
                    <Input placeholder="slug" {...field} />
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="btn bg-blue-500 text-white rounded"
                    >
                      Tạo slug
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội Dung</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Enter content here"
                    rows={5}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="block mb-2">Ảnh đại diện</span>
          <FileUpload
            serverImageUrl={category?.featureImg?.path}
            onUploadFeatureImg={onUploadFeatureImg}
            onDeleteFeatureImg={onDeleteFeatureImg}
          />
          <FormField
            control={form.control}
            name="parent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục cha</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn danh mục cha</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isFeature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hiển thị ở trang chủ</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value || false} // Ensure `checked` is properly bound
                      className="w-5 h-5 border-gray-300 rounded  ml-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục mặc định</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value || false} // Ensure `checked` is properly bound
                      className="w-5 h-5 border-gray-300 rounded  ml-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Index</FormLabel>
                  <FormControl>
                    <input
                      className="input input-bordered w-full rounded-md"
                      type="number"
                      value={field.value} // Bind the field's value
                      onChange={(e) => field.onChange(Number(e.target.value))} // Convert value to a number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn btn-primary bg-blue-700 w-40 text-white mx-auto flex items-center mt-6"
          >
            {loading ? <Loader className="animate-spin" /> : ""}
            Submit
          </button>
        </form>
      </Form>
    </div>
  );
};

export default AddForm;
