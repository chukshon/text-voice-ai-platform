"use client";
import React from "react";
import HeroSection from "@/features/dashboard/hero";
import { useAuth } from "@/contexts/auth-context";

const DashboardPage = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <HeroSection name={user?.name ?? ""} />
    </div>
  );
};

export default DashboardPage;
