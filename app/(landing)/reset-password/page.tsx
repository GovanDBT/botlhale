"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";

// Schema for new password
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// infer typescript type from Zod reset password schema
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const supabase = createClient();

  // Listen for PASSWORD_RECOVERY event
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Handle password update
  const handleSubmit = async (data: ResetPasswordData) => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to reset password. Try again.");
      return;
    }

    toast.success("Password updated successfully! Please log in.");
    window.location.href = "/login"; // redirect to login
  };

  if (!passwordRecovery) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Waiting for password recovery link verification...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-[350px] bg-white p-6 rounded-lg shadow-md"
        >
          <h1 className="text-xl font-bold text-center">Reset Password</h1>

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner /> Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
