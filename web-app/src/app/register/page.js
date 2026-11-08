import React from "react";
import AuthCard from "@/components/auth/AuthCard";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-120px)]">
      <AuthCard initialMode="register" />
    </div>
  );
}
