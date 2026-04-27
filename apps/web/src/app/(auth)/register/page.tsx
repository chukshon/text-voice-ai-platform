import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/auth-layout";
import RegisterForm from "@/sections/auth/register-form";

export const metadata: Metadata = {
  title: "Create account — Text to Voice AI",
  description: "Create an account to start generating realistic speech in seconds",
};

const RegisterPage = () => {
  return (
    <AuthLayout title="Create an account" subtitle="Start generating realistic speech in seconds">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
