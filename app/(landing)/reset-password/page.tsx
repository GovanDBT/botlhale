// app/reset-password
// reset password form
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/services/supabase/client";
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
import { resetPasswordSchema } from "@/lib/validationSchema";
import { Eye, EyeOff } from "lucide-react";
import AppButton from "@/app/components/AppButton";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";

// Types
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // show or hide password
  const router = useRouter(); // programmatic navigation

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const supabase = createClient();

  // Detect PASSWORD_RECOVERY or SIGNED_IN session
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setPasswordRecovery(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Handle password update
  const handleSubmit = async (data: ResetPasswordData) => {
    try {
      setLoading(true);
      setError("");

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      // if password update fails
      if (updateError) {
        throw new Error(updateError.message || "Failed to change password.");
      }

      // if update password is a success
      toast.success(
        "Password changed successfully. Your will be redirected to login page shortly",
        {
          style: {
            background: "#576087",
            color: "#fff",
            borderColor: "#F6B595",
          },
        }
      );

      setTimeout(() => router.push("/login"), 3000); // redirects user to login

      // Immediately log out the temporary session
      const { error: signOutError } = await supabase.auth.signOut();

      // If logout fails
      if (signOutError) {
        throw new Error(
          signOutError.message || "Password updated, but failed to log out."
        );
      }
    } catch (err: any) {
      Sentry.captureException(`Change Password Error: ${err.message}`);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!passwordRecovery) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">
          Waiting for password recovery link verification...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[calc(98vh-74px)] overflow-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 max-w-[450px] min-w-[250px] bg-white p-6 rounded-lg shadow-md"
        >
          {/* header */}
          <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Change Password</h1>

          {/* error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* new password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="newPassword"
                  className="text-base sm:text-sm"
                >
                  New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      className="h-12 sm:h-10 pr-10"
                      {...field}
                      placeholder="Enter new password"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#F6B595" />
                    ) : (
                      <Eye size={18} color="#F6B595" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* confirm new password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="confirmPassword"
                  className="text-base sm:text-sm"
                >
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="newPassword"
                    className="h-12 sm:h-10 pr-10"
                    {...field}
                    placeholder="Re-enter new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* change password button */}
          <AppButton type="submit" disabled={loading} className="w-full py-5">
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner /> Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </AppButton>

          <p className="text-xs text-center text-gray-500">
            You will be redirected to the login page after you change your
            password.
          </p>
        </form>
      </Form>
    </div>
  );
}
