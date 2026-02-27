"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) router.push("/login");
  }, [router]);
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />
      <main className="ml-52 flex-1 p-6">{children}</main>
    </div>
  );
}
