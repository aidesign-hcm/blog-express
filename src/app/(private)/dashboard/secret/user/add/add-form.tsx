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
import FileUpload from "@/components/FileUpload";
import { useForm } from "react-hook-form";
import {
  AdminRegisterBody,
  AdminRegisterBodyType,
} from "@/schemaValidations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserFormValues = z.infer<typeof AdminRegisterBody>;

type AddFormProps = {
  onSubmit: (data: UserFormValues) => Promise<void>; // Submit handler
};

const AddForm = ({ onSubmit }: AddFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<AdminRegisterBodyType>({
    resolver: zodResolver(AdminRegisterBody),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      phonenumber: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
              <FormControl>
                <Input placeholder="email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
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
              <FormControl>
                <Input placeholder="Số điện thoại" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 text-red-500 text-sm font-medium">
          {errorMessage}
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
  );
};

export default AddForm;
