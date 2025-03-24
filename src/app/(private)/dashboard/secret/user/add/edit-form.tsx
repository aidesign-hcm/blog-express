"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "react-feather";
import { useForm } from "react-hook-form";
import {
  AdminEditResBody,
  AdminEditResBodyType,
  PasswordResBodyType,
  PasswordResBody,
} from "@/schemaValidations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryRes } from "@/schemaValidations/category.schema";

type UserFormValues = z.infer<typeof AdminEditResBody>;
type CategoryFormValues = z.infer<typeof CategoryRes>;

type AddFormProps = {
  user?: UserFormValues;
  oncategories?: CategoryFormValues;
  onSubmit: (data: UserFormValues) => Promise<void>; // Submit handler
  onSubmitPass: (data: PasswordResBodyType) => Promise<void>;
};

const EditForm = ({
  user,
  onSubmit,
  onSubmitPass,
  oncategories,
}: AddFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const genders = ["Male", "Female", "Not"];
  const ranks = ["1", "2", "3", "4", "5"];
  const rules = ["user", "manager", "editor"];

  const form = useForm<AdminEditResBodyType>({
    resolver: zodResolver(AdminEditResBody),
    defaultValues: user || {
      _id: "",
      email: "",
      username: "",
      phonenumber: "",
      private: false,
      rule: "user",
      rank: "1",
      gender: "Not",
      bio: "",
      categories: [],
    },
  });
  const rule = form.watch("rule");

  console.log("Form Errors:", form.formState);

  const formPass = useForm<PasswordResBodyType>({
    resolver: zodResolver(PasswordResBody),
    defaultValues: {
      _id: user?._id || "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-12 flex-shrink-0 w-full"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 relative">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới Tính</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Chọn giới tính</option>
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức Vụ</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={rule === "admin"} // Disable select when rule is "admin"
                    >
                      <option value="">Chọn chức vụ</option>
                      {rules.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cấp độ thành viên</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Chọn cấp độ</option>
                      {ranks.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khoá Thành viên</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          {...field}
                          type="radio"
                          className="radio radio-primary mr-2"
                          value="true"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                        />
                        <span>Khoá Khách hàng</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          {...field}
                          type="radio"
                          className="radio radio-primary mr-2"
                          value="false"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                        />
                        <span>Hoạt động</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn Danh Mục được đăng bài</FormLabel>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 mt-4">
                    {oncategories.map((category) => (
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
          </div>
          <div className="mt-2 text-red-500 text-sm font-medium">
            {errorMessage}
          </div>
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn btn-primary bg-blue-700 w-40 text-white mx-auto flex items-center mt-6"
          >
            {loading ? <Loader className="animate-spin" /> : ""}
            Xác Nhận
          </button>
        </form>
      </Form>
      <Form {...formPass}>
        <form
          onSubmit={formPass.handleSubmit(onSubmitPass)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full mx-auto mt-8"
          noValidate
        >
          <FormField
            control={formPass.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formPass.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Xác nhận mật khẩu"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn btn-primary mt-8 bg-blue-700 w-40 text-white mx-auto flex items-center"
          >
            {loading ? <Loader className="animate-spin" /> : ""}
            Update Password
          </button>
        </form>
      </Form>
    </>
  );
};

export default EditForm;
