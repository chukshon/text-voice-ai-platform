import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/auth-layout";
import LoginForm from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in - Text to Voice AI",
  description: "Sign in to your account to continue",
};

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back!" subtitle="Sign in to your account to continue">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
