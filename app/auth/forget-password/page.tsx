"use client"

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { forgetPassword, resetPassword } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ForgetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    return (
        <div className="max-w-md mx-auto w-full p-4">
          <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
          <p className="mb-4 text-muted-forgeground">
            Enter your email address and we&apps;ll send you a link to reset your password
          </p>

          <form action={async (formData) => {
            const email = formData.get("email");
            await forgetPassword({
              email: email as string,
              redirectTo: "/auth/forget-password"
            }, {
              onError: (ctx) => {
                toast.error(ctx.error.message)
              },
              onSuccess: () => {
                toast.success("Reset Link sent to email")
                router.push("/auth/signin")
              }
            })
          }}
                className="flex gap-2"
          >
            <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email address"
            />

            <Button type="submit">Send Reset Link</Button>
          </form>
        </div>
    )
  }

  return (
      <div className="max-w-md mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="mb-4 text-muted-forgeground">
          Enter your email address and we&apps;ll send you a link to reset your password
        </p>

        <form action={async (formData) => {
          const newPassword = formData.get("password");
          await resetPassword({
            newPassword: newPassword as string,
            token: token as string
          },{
            onError: (ctx) => {
              toast.error(ctx.error.message)
            },
            onSuccess: () => {
              toast.success("Password reset successfully")
              router.push("/auth/signin")
            }
          })
        }}
              className="flex gap-2"
        >
          <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
          />

          <Button type="submit">Reset Password</Button>
        </form>
      </div>
  )
}

export default function ForgetPassword() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <ForgetPasswordForm />
      </Suspense>
  );
}