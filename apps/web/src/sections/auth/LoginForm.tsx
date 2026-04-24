import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { loginInputSchema, LoginInputT } from "@/schema/auth.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLoginMutation } from "@/services/auth/mutations";

const LoginForm = () => {
  const { mutate: login, isPending: loading, error } = useLoginMutation();
  const form = useForm<LoginInputT>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginInputT) {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/70">
          Email
        </Label>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="you@example.com"
                className="h-11 bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground/70">
          Password
        </Label>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
