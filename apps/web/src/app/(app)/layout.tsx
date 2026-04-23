"use client";
import React from "react";
import AppLayout from "@/components/layout";

const RootAppLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppLayout>{children}</AppLayout>;
};

export default RootAppLayout;
