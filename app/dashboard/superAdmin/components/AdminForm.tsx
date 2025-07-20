/**
 * Admin registration form component
 */
"use client";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// modules
import { cn } from "@/lib/utils";
import AppButton from "@/app/components/AppButton";
import { createClient } from "@/services/supabase/client";

// school interface
interface Props {
  formRef?: React.RefObject<HTMLFormElement | null>;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

type School = {
  id: number;
  name: string;
};

// define schema for admin
// type schoolData = z.infer<typeof schoolSchema>;

const AdminForm = ({}) => {
  // react hook form
  const form = useForm();

  const supabase = createClient(); // Initialize Supabase client

  // Fetch schools from Supabase
  const fetchSchools = async (): Promise<School[]> => {
    const { data, error } = await supabase.from("school").select("id, name");
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  };

  // Use React Query to manage fetched schools
  const { data: schools = [], isLoading } = useQuery<School[], Error>({
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });

  return (
    <div>
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form className="mt-6">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-10">
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
                                (school) => school.name === field.value
                              )?.name
                            : "Select School"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search school..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            {isLoading
                              ? "Loading Schools..."
                              : "No Schools found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {schools.map((school) => (
                              <CommandItem
                                value={school.name}
                                key={school.id}
                                onSelect={() => {
                                  form.setValue("school", school.name);
                                }}
                              >
                                {school.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    school.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          {/* Register button */}
          <AppButton type="submit" className="my-10">
            Create Admin
          </AppButton>
        </form>
      </Form>
    </div>
  );
};

export default AdminForm;
