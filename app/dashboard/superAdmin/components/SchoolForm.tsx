"use client";
import React from "react";
import { useForm } from "react-hook-form";

// shadcn components
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
import { Button } from "@/components/ui/button";

const SchoolForm = () => {
  // react hook form
  const form = useForm();
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
                    School Name:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      className="h-12 sm:h-10"
                      placeholder="eg. Strype Senior School"
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
                    Location:
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
                    Email:
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
                    Phone:
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
            {/* School admin */}
            <FormField
              control={form.control}
              name="admin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin" className="text-base sm:text-sm">
                    Invite School Admin
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="admin"
                      className="h-12 sm:h-10"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* Login button */}
          <Button
            type="submit"
            className="w-full md:w-auto text-base sm:text-sm py-6 sm:py-5 mt-10 cursor-pointer"
          >
            Create School
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SchoolForm;
