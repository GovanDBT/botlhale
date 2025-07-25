/**
 * Admin registration form component
 */
"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Rollbar from "rollbar";
import axios from "axios";
// Lucide icons
import { Check, ChevronsUpDown } from "lucide-react";
// shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
// modules
import { cn } from "@/lib/utils";
import { adminSchema } from "@/lib/validationSchema";
import { useSelectSchools } from "@/hooks/useSchools";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clientConfig } from "@/services/rollbar/rollbar";

// admin interface
interface Props {
  formRef?: React.RefObject<HTMLFormElement | null>;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

// define schema for admin
type adminData = z.infer<typeof adminSchema>;

const AdminForm = ({ formRef, onSubmittingChange }: Props) => {
  // define form using react hook form
  const form = useForm<adminData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      school_id: 0,
    },
  });

  // fetch schools using react query
  const { data: schools = [], isLoading, error } = useSelectSchools();

  // Rollbar instance for client-side logging
  const rollbar = new Rollbar(clientConfig);

  // submit handler
  const onSubmit = async (data: adminData) => {
    onSubmittingChange?.(true);
    try {
      const promise = axios
        .post("/api/users/admin", data)
        .then((response) => response.data);

      toast.promise(promise, {
        loading: "Creating admin...",
        success: () => {
          form.reset();
          return "Admin has been successfully created";
        },
        error: (err: any) => {
          const apiError = err?.response?.data?.error;
          if (apiError) return apiError;
          rollbar.error("Unexpected error while creating admin", err);
          return "An unexpected error occurred while creating admin, please try again later";
        },
      });
      try {
        await promise;
      } finally {
        onSubmittingChange?.(false);
      }
    } catch (error) {
      rollbar.error("Unexpected error while creating admin", error as Error);
    }
  };

  return (
    <div>
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-7">
            {/* first name */}
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="firstname"
                    className="text-base sm:text-sm"
                  >
                    First Name: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="firstname"
                      className="h-12 sm:h-10"
                      placeholder="e.g. Letsile"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* last name */}
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="lastname"
                    className="text-base sm:text-sm"
                  >
                    Last Name: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="lastname"
                      className="h-12 sm:h-10"
                      placeholder="e.g. Tebogo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Admin Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-base sm:text-sm">
                    Admin Email: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      className="h-12 sm:h-10"
                      placeholder="example@school.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="lg:text-xs text-sm">
                    Invite will be sent to this email address
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Admin phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone" className="text-base sm:text-sm">
                    Admin Phone: <span className="text-red-400">*</span>
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
            {/* Select School */}
            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="school" className="text-base sm:text-sm">
                    School: <span className="text-red-400">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-12 sm:h-10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? schools.find(
                                (school) => school.id === field.value
                              )?.name
                            : "Select School"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[270px] h-[170px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search school..."
                          className="h-9"
                        />
                        <CommandList>
                          <ScrollArea className="h-[130px]">
                            {isLoading && (
                              <CommandEmpty>
                                {isLoading
                                  ? "Loading Schools..."
                                  : "No Schools found."}
                              </CommandEmpty>
                            )}
                            {error && (
                              <p className="text-red-500 text-sm text-center py-5">
                                {error.message}
                              </p>
                            )}
                            <CommandGroup>
                              {schools &&
                                schools.map((school) => (
                                  <CommandItem
                                    value={school.name}
                                    key={school.id}
                                    onSelect={() => {
                                      form.setValue("school_id", school.id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                        shouldTouch: true,
                                      });
                                    }}
                                  >
                                    {school.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        school.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminForm;
