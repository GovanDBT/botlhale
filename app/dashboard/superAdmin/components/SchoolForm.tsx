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
// shadcn components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// modules
import AppButton from "@/app/components/AppButton";

// import Mark-down-editor using lazy loading
// simpleMDE is a client-side component that is rendered in the server
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // disable server-side rendering
});

const SchoolForm = () => {
  const form = useForm(); // react hook form

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

  return (
    <div>
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form className="mt-6">
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
          <AppButton type="submit" className="my-5">
            Create School
          </AppButton>
        </form>
      </Form>
    </div>
  );
};

export default SchoolForm;
