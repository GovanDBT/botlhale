/**
 * School registration form component
 */
"use client";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import ReactDOMServer from "react-dom/server";
import { useForm } from "react-hook-form"; // react forms
import dynamic from "next/dynamic";
import SimpleMDE from "easymde";
import "easymde/dist/easymde.min.css"; // Mark-down-editor css
import { schoolSchema } from "@/lib/validationSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
// shadcn components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// modules
import AppButton from "@/app/components/AppButton";
import { Button } from "@/components/ui/button";

// import Mark-down-editor using lazy loading
// simpleMDE is a client-side component that is rendered in the server
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // disable server-side rendering
});

type schoolData = z.infer<typeof schoolSchema>;

const SchoolForm = () => {
  // define form
  const form = useForm<schoolData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  // Custom renderer options for SimpleMDE
  const customRendererOptions = useMemo(() => {
    return {
      previewRender(text: string) {
        return ReactDOMServer.renderToString(
          <div className="prose">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        );
      },
    } as SimpleMDE.Options;
  }, []);

  // submit handler
  const onSubmit = async (data: schoolData) => {
    await axios.post("/api/schools", data);
  };

  return (
    <div>
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-10">
            {/* School name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-base sm:text-sm">
                    School Name: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      className="h-12 sm:h-10"
                      placeholder="eg. Strype Senior School"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* School location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="location"
                    className="text-base sm:text-sm"
                  >
                    Location: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="location"
                      className="h-12 sm:h-10"
                      placeholder="village/town/city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* School Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-base sm:text-sm">
                    Email: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      className="h-12 sm:h-10"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* School phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone" className="text-base sm:text-sm">
                    Phone: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      id="phone"
                      className="h-12 sm:h-10"
                      placeholder="+267 ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* School description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel
                    htmlFor="description"
                    className="text-base sm:text-sm"
                  >
                    Description:
                  </FormLabel>
                  <FormControl>
                    <SimpleMdeReact
                      placeholder="School description..."
                      options={customRendererOptions}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* Register button */}
          <Button className="rounded-[3px] cursor-pointer px-6 py-5 font-bold line uppercase tracking-wide text-nowrap">
            Create School
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SchoolForm;
