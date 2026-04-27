"use client";
import HeroSection from "@/features/dashboard/hero";
import QuickActionSection from "@/features/dashboard/quick-action";
import { useAuth } from "@/contexts/auth-context";

const DashboardPage = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <HeroSection name={user?.name ?? ""} />
      <QuickActionSection />
    </div>
  );
};

export default DashboardPage;
