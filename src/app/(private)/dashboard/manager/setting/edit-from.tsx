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
import { Loader } from "react-feather";
import { settingRes } from "@/schemaValidations/common.schema";
import { z } from "zod";
import settingApiRequest from "@/apiRequests/common";
import { toast } from "react-toastify";
import FileUpload from "@/components/FileUpload";
import mediaApiRequest from "@/apiRequests/media";

type SettingFormValues = z.infer<typeof settingRes>;

const EditForm = () => {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingRes),
    defaultValues: {
      ads1: "",
      logo: {
        path: "",
        folder: "",
        _id: "",
      }, 
    },
  });

  const { reset } = form; // Get reset function

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setLoading(true);
        const sessionToken = localStorage.getItem("sessionToken") || "";
        const resSetting = await settingApiRequest.fetchSetting(sessionToken);
        if (resSetting.payload.success) {
          setSetting(resSetting.payload.setting); // Update state
          reset(resSetting.payload.setting); // Reset form with new data
        } else {
          console.error("Failed to fetch");
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, [reset]); // Add `reset` as a dependency

  const handleSubmit = async (data: SettingFormValues) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await settingApiRequest.EditorSetting(data, sessionToken);
      if (result.payload.success) {
        toast.success("Thành Công");
        setSetting(result.payload.setting);
      } else {
        toast.error("An error occurred during update. Please try again.");
        console.error("Error creating category:", result.payload.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  };

  const onUploadFeatureImg = async (imageFile: File) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append("imageFile", imageFile);
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await mediaApiRequest.postLogo(data, sessionToken);
      if (result) {
        toast.success("Đăng hình ảnh thành công.");
        setTimeout(() => {
          form.setValue("logo", result.payload.featureImg);
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
    form.setValue("logo", {
      path: "",
      folder: "",
      _id: "",
    });
  };

  const onUploadFile = async (file: File) => {
    setUploadingFile(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await mediaApiRequest.postLogo(data, sessionToken);
      if (result) {
       
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
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="px-12 flex-shrink-0 w-full"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 relative">

             <FormField
              control={form.control}
              name="ads1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khung quảng cáo 1</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Mã Quảng cáo"
                      className="border p-2 rounded w-full h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
            <span className="block mb-2">Logo website</span>
              <FileUpload
                serverImageUrl={setting?.logo?.path}
                onUploadFeatureImg={onUploadFeatureImg}
                onDeleteFeatureImg={onDeleteFeatureImg}
              />
              </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary bg-blue-700 w-40 text-white mx-auto flex items-center mt-6"
          >
            {loading ? <Loader className="animate-spin" /> : "Submit"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;
