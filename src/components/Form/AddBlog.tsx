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
import { BlogUserCreate } from "@/schemaValidations/blog.schema"; // Import the schema
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { z } from "zod";
import { generateSlugFromName } from "@/utils/slugGenerator";
import FileUpload from "@/components/FileUpload";
import mediaApiRequest from "@/apiRequests/media";
import categoryApiRequest from "@/apiRequests/category";
import TiptapEditor from "@/components/Widget/TiptapEditor";
import envConfig from "@/config";

type BlogValues = z.infer<typeof BlogUserCreate>[0];

type AddFormProps = {
  blog?: BlogValues;
  onSubmit: (data: BlogValues) => Promise<void>; // Submit handler
};

const AddForm = ({ blog, onSubmit }: AddFormProps) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<BlogValues>({
    resolver: zodResolver(BlogUserCreate.element),
    defaultValues: blog || {
      _id: "",
      user: null,
      title: "",
      featureImg: {
        path: "",
        folder: "",
        _id: "",
      },
      slug: "",
      desc: "",
      short: "",
      categories: [],
      file: null,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const resCategories = await categoryApiRequest.fetchAllCategoriesByUser(
          sessionToken
        );
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
  const nameValue = watch("title");
  const handleGenerateSlug = () => {
    if (!nameValue) {
      toast.error("Please enter a name to generate the slug.");
      return;
    }
    const slug = generateSlugFromName(nameValue);
    setValue("slug", slug);
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
        toast.success("Đăng hình ảnh thành công.");
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

  const content = watch("desc");

  const [uploadingFile, setUploadingFile] = useState(false);

  const onUploadFile = async (file: File) => {
    setUploadingFile(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await mediaApiRequest.postFileMedia(data, sessionToken);
      if (result) {
        console.log(result);
        toast.success("File uploaded successfully.");
        form.setValue("file", { path: result.payload.fileUrl });
      } else {
        toast.error("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mx-auto">
            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="title"
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
              <div className="my-4">
                <FormLabel>Nội Dung</FormLabel>
                <TiptapEditor
                  value={content} // Pass the form's `content` value
                  onChange={(newContent) => setValue("desc", newContent)} // Update `content` in the form
                />
              </div>
              <FormField
                control={form.control}
                name="short"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội Dung ngắn</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Giới thiệu về bài viết"
                        rows={5}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Danh Mục</FormLabel>
                    <div className="max-h-36 overflow-scroll border p-4 rounded">
                      {categories.map((category) => (
                        <label key={category._id} className="block mb-2">
                          <input
                            type="checkbox"
                            className="mr-2"
                            value={category._id}
                            checked={field.value?.includes(category._id)} // Check if selected
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), category._id] // Add if checked
                                : field.value.filter(
                                    (id: string) => id !== category._id
                                  ); // Remove if unchecked
                              field.onChange(newValue); // Update form state
                            }}
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <span className="block mb-2">Ảnh đại diện</span>

              <FileUpload
                serverImageUrl={blog?.featureImg?.path}
                onUploadFeatureImg={onUploadFeatureImg}
                onDeleteFeatureImg={onDeleteFeatureImg}
              />
              <div className="border p-4 rounded">
                <span className="block mb-2">Đăng File</span>
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="file"
                          accept=".pdf,.xlsx,.xls,.txt,.doc,.docx,.pptx,.rar,.zip"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              onUploadFile(e.target.files[0]);
                            }
                          }}
                        />
                      </FormControl>
                      {uploadingFile && <p>Uploading...</p>}
                      {field.value?.path && (
                        <div className="mt-2">
                          <p>
                            Uploaded file:{" "}
                            <a
                              href={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}${field.value.path}`}
                              target="_blank"
                              className="text-blue-500"
                            >
                              Xem File
                            </a>
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
