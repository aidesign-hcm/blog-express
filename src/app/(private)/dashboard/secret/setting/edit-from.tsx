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
      title: "",
      desc: "",
      address: "",
      email: "",
      hotline: "",
      contact: "",
      copyright: "",
      footerBLock1: "",
      footerBLock2: "",
      openReg: true,
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
      const result = await settingApiRequest.CraeteSetting(data, sessionToken);
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

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="px-12 flex-shrink-0 w-full"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 relative">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề trang web</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mô tả" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hotline */}
            <FormField
              control={form.control}
              name="hotline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotline</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập hotline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Copyright */}
            <FormField
              control={form.control}
              name="copyright"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copyright</FormLabel>
                  <FormControl>
                    <Input placeholder="copyright" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên hệ (HTML)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Thông tin liên hệ "
                      className="border p-2 rounded w-full h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerBLock1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer Block 1 (HTML)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Nội dung Block 1"
                      className="border p-2 rounded w-full h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="footerBLock2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer Block 2 (HTML)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Nội dung Block 2"
                      className="border p-2 rounded w-full h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="openReg"
              render={({ field }) => (
                <FormItem>
                <FormLabel><span className="block mb-4">Cho phép thành viên đăng ký</span></FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value} // ✅ Ensure the checkbox state is properly controlled
                      onChange={field.onChange} // ✅ Handle changes correctly
                      className="w-5 h-5 border-gray-300 rounded mr-4"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                   Mở đăng ký
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
            <span className="block mb-2">Logo web</span>
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
