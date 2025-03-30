import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              className="text-xs text-primary hover:underline"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <LockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              className="pl-10"
              required
            />
          </div>
        </div>

        <SubmitButton
          pendingText="Signing in..."
          formAction={signInAction}
          className="w-full"
        >
          Sign in
        </SubmitButton>

        <FormMessage message={searchParams} />
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href="/sign-up"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
