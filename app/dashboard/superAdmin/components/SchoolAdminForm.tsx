// app/dashboard/superAdmin/components/SchoolAdminForm.tsx
// School Admin registration form component
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
// Lucide icons
import { Check, ChevronsUpDown } from "lucide-react";
// shadcn components
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
// modules
import { ScrollArea } from "@/components/ui/scroll-area";
import useAddSchoolAdmin from "@/hooks/useAddSchoolAdmin";
import { useSelectSchools } from "@/hooks/useSchools";
import useUpdateSchoolAdmin from "@/hooks/useUpdateSchoolAdmin";
import { cn } from "@/lib/utils";
import {
  schoolAdminSchema,
  updateSchoolAdminSchema,
} from "@/lib/validationSchema";
import { Profile } from "@/utils/interfaces";

// school admin interface
interface Props {
  formRef?: React.RefObject<HTMLFormElement | null>;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  data?: Profile;
}

// define schema for school admin data
type schoolAdminData = z.infer<typeof schoolAdminSchema>;
type updateSchoolAdminData = z.infer<typeof updateSchoolAdminSchema>;

const SchoolAdminForm = ({ formRef, onSubmittingChange, data }: Props) => {
  // define form using react hook form
  const form = useForm<schoolAdminData>({
    resolver: zodResolver(schoolAdminSchema),
    defaultValues: {
      id: data?.id || "",
      firstname: data?.firstname || "",
      lastname: data?.lastname || "",
      email: data?.email || "",
      phone: data?.phone || "",
      school: data?.school?.id || 0,
    },
  });

  // custom hook for creating a new school admin with cache refresh
  const addSchoolAdmin = useAddSchoolAdmin(
    async (request) => {
      await toast.promise(request, {
        loading: "Creating school admin...",
        success: () => {
          form.reset();
          return "School admin has been successfully created";
        },
        error: (err: any) => {
          return err.message || "An unexpected error has occurred";
        },
      });
    },
    () => onSubmittingChange?.(false)
  );

  // custom hook for creating a new school admin with cache refresh
  const updateSchoolAdmin = useUpdateSchoolAdmin(
    async (request) => {
      await toast.promise(request, {
        loading: "Updating school admin...",
        success: () => {
          return "School admin has been successfully updated";
        },
        error: (err: any) => {
          return err.message || "An unexpected error has occurred";
        },
      });
    },
    () => onSubmittingChange?.(false)
  );

  // fetch schools using react query
  const { data: schools = [], isLoading, error } = useSelectSchools();

  // submit handler
  const onSubmit = async (formData: schoolAdminData) => {
    onSubmittingChange?.(true);
    if (data) {
      updateSchoolAdmin.mutate(formData as updateSchoolAdminData);
    } else {
      addSchoolAdmin.mutate(formData);
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
            {/* school admin email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-base sm:text-sm">
                    School Admin Email: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      className="h-12 sm:h-10"
                      placeholder="example@school.com"
                      disabled={data ? true : false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {!data && (
                    <FormDescription className="lg:text-xs text-sm">
                      Invite will be sent to this email address
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            {/* school admin phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone" className="text-base sm:text-sm">
                    School Admin Phone: <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      id="phone"
                      className="h-12 sm:h-10"
                      placeholder="+267 ..."
                      disabled={data ? true : false}
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
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="school" className="text-base sm:text-sm">
                    School: <span className="text-red-400">*</span>
                  </FormLabel>
                  <Popover modal={true}>
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
                    <PopoverContent className="w-[270px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search school..."
                          className="h-9"
                        />
                        <CommandList>
                          <ScrollArea className="flex-1 overflow-y-auto">
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
                              {schools.map((school) => (
                                <CommandItem
                                  key={school.id}
                                  value={school.name}
                                  onSelect={() => {
                                    form.setValue("school", school.id, {
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

export default SchoolAdminForm;
