"use client";

// import
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// shadcn components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const RegistratonForm = () => {
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const router = useRouter();
    const form = useForm(); // react hook form

    return (
        <>
            <div className="">
                {/* Form - shadcn */}
                <Form {...form}>
                    {/* Form - react hook form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-row max-w-sm space-y-8"
                    >
                        {/* Form Title */}
                        <h1 className="text-2xl/8 sm:text-xl/8 font-bold">
                            Register for an account
                        </h1>
                        {errors.general && (
                            <p className="text-red-500">{errors.general[0]}</p>
                        )}
                        {/* First Name input field */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={() => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="firstName"
                                        className="text-base sm:text-sm"
                                    >
                                        First Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            id="firstName"
                                            value={formData.firstName}
                                            className="h-12 sm:h-10"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                        />
                                    </FormControl>
                                    {errors.firstName && (
                                        <p className="text-red-500 text-base sm:text-sm">
                                            {errors.firstName[0]}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                        {/* Last Name input field */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={() => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="lastName"
                                        className="text-base sm:text-sm"
                                    >
                                        Last Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            id="lastName"
                                            value={formData.lastName}
                                            className="h-12 sm:h-10"
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                        />
                                    </FormControl>
                                    {errors.lastName && (
                                        <p className="text-red-500 text-base sm:text-sm">
                                            {errors.lastName[0]}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </>
    );
};

export default RegistratonForm;
