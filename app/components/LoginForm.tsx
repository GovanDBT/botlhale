// app/components/LoginForm.tsx
// Login form component
"use client";
// modules
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import z from "zod";
import { CircleArrowLeftIcon, Eye, EyeOff } from "lucide-react";
// Shadcn UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// custom modules
import { loginSchema } from "@/lib/validationSchema";
import Spinner from "./Spinner";
import Link from "next/link";
import AppButton from "./AppButton";
import * as Sentry from "@sentry/nextjs";

// infer TypeScript type from Zod login schema
type LoginData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null); // when error message occurs
  const [isRedirecting, setIsRedirecting] = useState(false); // when user is redirected
  const [forcePasswordChange, setForcePasswordChange] = useState(false); // when user is forced to change password
  const [showPassword, setShowPassword] = useState(false); // show or hide password
  const router = useRouter(); // programmatic navigation

  // Initialize form with Zod validation
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      forcePasswordChange: false,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // handle submit login form
  const handleSubmit = async (data: LoginData) => {
    try {
      setError(null);
      setIsRedirecting(true);

      // if password = user_id
      if (forcePasswordChange) {
        const res = await axios.put("/api/auth/change-password", {
          email: data.email,
          newPassword: data.newPassword,
        });

        if (res.data.success) {
          setForcePasswordChange(false);
          toast.success("Password changed successfully. Please log in again.", {
            style: {
              background: "#576087",
              color: "#fff",
              borderColor: "#F6B595",
            },
          });
          form.reset();
        } else {
          Sentry.captureException(
            `User password change failed: ${res.data.error}`
          );
          setError(res.data.error || "Failed to change password.");
        }

        setIsRedirecting(false);
        return;
      }

      // Normal login
      const res = await axios.post("/api/auth/login", data);

      // Handle force password change response
      if (res.data.forcePasswordChange) {
        setForcePasswordChange(true);
        form.setValue("forcePasswordChange", true);
        setIsRedirecting(false);
        return;
      }

      if (!res.data.success) {
        Sentry.captureException(
          `System failed to login user: ${res.data.error}`
        );
        setError(
          res.data.error || "System currently down, please try again later"
        );
        setIsRedirecting(false);
        return;
      }

      // Success: redirect user
      router.push(res.data.redirectPath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Sentry.captureException(`Unexpected login fail: ${error.message}`);
        setError(
          "An unexpected login error has occurred! please try again later."
        );
      } else {
        Sentry.captureException(`Unknown login fail error: ${error}`);
        setError("An unexpected error has occurred! please try again later.");
      }
      setIsRedirecting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-row max-w-sm space-y-8"
      >
        {/* Form header */}
        {!forcePasswordChange ? (
          <h1 className="text-2xl/8 sm:text-xl/8 font-bold">
            Sign in to your account
          </h1>
        ) : (
          <h1 className="text-2xl/8 sm:text-xl/8 font-bold flex items-center gap-2">
            <Button
              variant="link"
              className="
                p-0 cursor-pointer hover:-translate-x-0.5"
              title="Back to login"
              asChild
              onClick={() => {
                form.setValue("forcePasswordChange", false);
                setForcePasswordChange(false);
              }}
            >
              <CircleArrowLeftIcon color="#576087" />
            </Button>
            Please change your password
          </h1>
        )}

        {/* Show error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email" className="text-base sm:text-sm">
                Email or Phone
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  id="email"
                  autoComplete="email"
                  className="h-12 sm:h-10"
                  disabled={forcePasswordChange}
                  {...field}
                />
              </FormControl>
              {/* Client-side validation errors */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password or new password field */}
        {!forcePasswordChange ? (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password" className="text-base sm:text-sm">
                  Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="h-12 sm:h-10 pr-10"
                      {...field}
                    />
                  </FormControl>
                  {/* Eye icon button */}
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
        ) : (
          <>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        {...field}
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
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
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
                    <Input id="confirmPassword" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Remember me + forgot password */}
        {!forcePasswordChange && (
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember" className="text-base sm:text-sm">
                Remember Me
              </Label>
            </div>
            <Link href="#" className="text-base sm:text-sm font-semibold link">
              Forgot Password?
            </Link>
          </div>
        )}

        {/* Login button */}
        <AppButton
          type="submit"
          disabled={isRedirecting}
          className="w-full py-5"
        >
          {!forcePasswordChange ? (
            <>
              {" "}
              {isRedirecting ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  Redirecting...
                </div>
              ) : (
                "Login"
              )}
            </>
          ) : (
            <>
              {" "}
              {isRedirecting ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  Changing Password...
                </div>
              ) : (
                "Change Password"
              )}
            </>
          )}
        </AppButton>

        {/* Footer */}
        <p className="text-base sm:text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="link">
            How to register
          </Link>
        </p>
        <p className="text-xs">
          By logging in you agree to our{" "}
          <Link href="#" className="link">
            Terms of Use
          </Link>{" "}
          and our{" "}
          <Link href="#" className="link">
            Privacy Policy
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;
