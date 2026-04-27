"use client";
import React from "react";
import AppLayout from "@/components/layout";
import ProtectedRoute from "@/components/guards/protected";

const RootAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};

export default RootAppLayout;
