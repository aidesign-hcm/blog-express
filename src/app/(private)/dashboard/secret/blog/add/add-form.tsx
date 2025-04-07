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
import { BlogCreateType, BlogCreate } from "@/schemaValidations/blog.schema"; // Import the schema
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { generateSlugFromName } from "@/utils/slugGenerator";
import FileUpload from "@/components/FileUpload";
import mediaApiRequest from "@/apiRequests/media";
import categoryApiRequest from "@/apiRequests/category";
import TiptapEditor from "@/components/Widget/TiptapEditor";
import envConfig from "@/config";
import { useAuth } from "@/hooks/useAuth";


type BlogValues = z.infer<typeof BlogCreate>[0];

type AddFormProps = {
  blog?: BlogValues;
  onSubmit: (data: BlogValues) => Promise<void>; // Submit handler
};

const AddForm = ({ blog, onSubmit }: AddFormProps) => {
  const { hasPermission } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isCode, setIsCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<BlogValues>({
    resolver: zodResolver(BlogCreate.element), // Use schema for validation
    defaultValues: blog || {
      _id: "",
      user: null,
      title: "",
      featureImg: {
        path: "",
        folder: "",
        _id: "",
      }, // Initialize featureImg as an object
      slug: "",
      desc: "",
      index: 0,
      isActive: true,
      short: "",
      categories: [],
      file: [],
      isFeature: false,
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

  const onUploadFiles = async (files: FileList | File[]) => {
    setUploadingFile(true);
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      let uploadedFiles: { path: string }[] = form.getValues("file") || []; // Get existing files

      for (const file of files) {
        const data = new FormData();
        data.append("file", file);

        try {
          const result = await mediaApiRequest.postFileMedia(
            data,
            sessionToken
          );
          if (result && result.payload.fileUrl) {
            uploadedFiles.push({ path: result.payload.fileUrl });
          }
        } catch (err) {
          console.error(`Error uploading file ${file.name}:`, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedFiles.length > 0) {
        toast.success("All files uploaded successfully.");
        form.setValue("file", uploadedFiles);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFile = (index: number) => {
    const files = form.getValues("file") || [];
    const updatedFiles = files.filter((_, i) => i !== index);
    form.setValue("file", updatedFiles);
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
                {/* Tab Switcher */}
                <div role="tablist" className="flex gap-2 my-2">
                  <span
                    role="tab"
                    className={`tab ${
                      !isCode ? "border rounded-md border-gray-500" : ""
                    }`}
                    onClick={() => setIsCode(false)}
                  >
                    Soạn Thảo Thường
                  </span>
                  <span
                    role="tab"
                    className={`tab ${
                      isCode ? "border rounded-md border-gray-500" : ""
                    }`}
                    onClick={() => setIsCode(true)}
                  >
                    Soạn HTML {isCode}
                  </span>
                </div>
                {!isCode ? (
                  <TiptapEditor
                    value={content}
                    onChange={(newContent) => setValue("desc", newContent)}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={15}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                        placeholder="Enter content here"
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
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        multiple
                        value={field.value || []} // Make sure value is an array
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          field.onChange(selectedOptions); // Update the field with selected values
                        }}
                      >
                        <option value="">Chọn danh mục</option>
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

              <span className="block mb-2">Ảnh đại diện</span>
              <FileUpload
                serverImageUrl={blog?.featureImg?.path}
                onUploadFeatureImg={onUploadFeatureImg}
                onDeleteFeatureImg={onDeleteFeatureImg}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value} // ✅ Ensure the checkbox state is properly controlled
                        onChange={field.onChange} // ✅ Handle changes correctly
                        className="w-5 h-5 border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      Kích hoạt bài viết
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeature"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-5 h-5 border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      Bài viết nổi bật
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
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
                          multiple
                          accept=".pdf,.xlsx,.xls,.txt,.doc,.docx,.pptx,.rar,.zip"
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              onUploadFiles(Array.from(e.target.files));
                            }
                          }}
                        />
                      </FormControl>

                      {uploadingFile && <p>Uploading...</p>}

                      {field.value?.length > 0 && (
                        <div className="mt-2">
                          <p>File đã được đăng:</p>
                          <ul className="list-disc">
                            {field.value.map(
                              (file: { path: string }, index: number) => {
                                const fileName = file.path.split("/").pop(); // Extract file name from path

                                return (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <a
                                      href={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}${file.path}`}
                                      target="_blank"
                                      className="text-blue-500 truncate max-w-[200px] inline-block"
                                      title={fileName} // Show full name on hover
                                    >
                                      {fileName}
                                    </a>
                                    {hasPermission("admin") && (
                                      <button
                                        type="button"
                                        className="text-red-500"
                                        onClick={() => removeFile(index)}
                                      >
                                        Xóa
                                      </button>
                                    )}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
            

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
