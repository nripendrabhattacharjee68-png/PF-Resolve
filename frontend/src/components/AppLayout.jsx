import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { AssistantPanel } from "@/components/AssistantPanel";
import { useTransfer } from "@/context/TransferContext";
import { Spinner } from "@/components/shared";

export function AppLayout() {
  const { loading } = useTransfer();

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto thin-scroll">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          {loading ? (
            <div className="flex h-[60vh] items-center justify-center text-slate-400">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
      <AssistantPanel />
    </div>
  );
}
