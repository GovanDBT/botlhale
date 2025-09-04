// app/dashboard/superAdmin/SchoolForm.tsx
// form component for registering a new school
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import SimpleMDE from "easymde";
import "easymde/dist/easymde.min.css"; // Mark-down-editor css
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useForm } from "react-hook-form"; // react forms
import ReactMarkdown from "react-markdown";
import Rollbar from "rollbar";
import z from "zod";
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
import { toast } from "sonner";
// modules
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schoolSchema } from "@/lib/validationSchema";
import { clientConfig } from "@/services/rollbar/rollbar";

// import Mark-down-editor using lazy loading
// simpleMDE is a client-side component that is rendered in the server
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // disable server-side rendering
});

// define schema
type schoolData = z.infer<typeof schoolSchema>;

interface Props {
  formRef?: React.RefObject<HTMLFormElement | null>;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

type Level = {
  value: string;
  label: string;
};

const levels: Level[] = [
  {
    value: "Senior School",
    label: "Senior School",
  },
  {
    value: "Junior School",
    label: "Junior School",
  },
  {
    value: "Primary School",
    label: "Primary School",
  },
];

const SchoolForm = ({ formRef, onSubmittingChange }: Props) => {
  // define form
  const form = useForm<schoolData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      level: "",
      email: "",
      phone: "",
      location: "",
      schoolName: "",
      type: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

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

  // Rollbar instance for client-side logging
  const rollbar = new Rollbar(clientConfig);

  // submit handler
  const onSubmit = async (data: schoolData) => {
    onSubmittingChange?.(true);
    try {
      const promise = axios
        .post("/api/schools", data)
        .then((response) => response.data);

      toast.promise(promise, {
        loading: "Creating school...",
        success: () => {
          form.reset();
          setSelectedLevel(null);
          return "School created successfully!";
        },
        error: (err: any) => {
          const apiError = err?.response?.data?.error;
          if (apiError) return apiError;
          rollbar.error("Unexpected error while creating school", err);
          return "An unexpected error occurred while creating school, please try again later";
        },
      });
      try {
        await promise;
      } finally {
        onSubmittingChange?.(false);
      }
    } catch (error) {
      rollbar.error("Unexpected error while creating school", error as Error);
    }
  };

  return (
    <div>
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-7">
            {/* School name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-base sm:text-sm">
                    School Name: <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        className="h-12 sm:h-10"
                        placeholder="e.g. Botlhale"
                        {...field}
                      />
                    </FormControl>
                    {/* School level */}
                    <Popover open={open} onOpenChange={setOpen} modal={true}>
                      <PopoverTrigger
                        asChild
                        className="absolute inset-y-[1] md:inset-y-[2] right-0.5 flex items-center"
                        tabIndex={-1}
                      >
                        <Button
                          variant="outline"
                          className="w-[160px] md:w-[240px] justify-start bg-primary text-white hover:bg-primary-darker hover:text-white cursor-pointer py-5.5 md:py-0"
                        >
                          {selectedLevel
                            ? selectedLevel.label
                            : "+ Set School Level"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {levels.map((level) => (
                                <CommandItem
                                  key={level.value}
                                  value={level.value}
                                  className="cursor-pointer"
                                  onSelect={(value) => {
                                    const selected =
                                      levels.find((l) => l.value === value) ||
                                      null;
                                    setSelectedLevel(selected);
                                    form.setValue("level", value, {
                                      shouldValidate: true,
                                    });
                                    setOpen(false);
                                  }}
                                >
                                  {level.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {form.formState.errors.level && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.level?.message}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* School type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="type" className="text-base sm:text-sm">
                    School Type: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full !h-12 sm:!h-10">
                        <SelectValue placeholder="Public/Private" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
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
        </form>
      </Form>
    </div>
  );
};

export default SchoolForm;
