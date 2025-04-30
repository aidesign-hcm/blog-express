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
import { PageCreate } from "@/schemaValidations/page.schema"; // Import the schema
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { z } from "zod";
import { generateSlugFromName } from "@/utils/slugGenerator";
import TiptapEditor from "@/components/Widget/TiptapEditor";
import { useAuth } from "@/hooks/useAuth";

type PageValues = z.infer<typeof PageCreate>[0];

type AddFormProps = {
  page?: PageValues;
  onSubmit: (data: PageValues) => Promise<void>; // Submit handler
};

const AddForm = ({ page, onSubmit }: AddFormProps) => {
  const [isCode, setIsCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<PageValues>({
    resolver: zodResolver(PageCreate.element), // Use schema for validation
    defaultValues: page || {
      _id: "",
      user: null,
      title: "",
      slug: "",
      desc: "",
      index: 0,
      isActive: true,
      short: "",
    },
  });


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

  const content = watch("desc");

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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value} 
                        onChange={field.onChange}
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
