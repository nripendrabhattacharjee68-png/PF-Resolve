import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/shared";

const ABSTRACT =
  "https://images.unsplash.com/photo-1645811791231-279658fb46dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxtaW5pbWFsJTIwYWJzdHJhY3QlMjBibHVlJTIwZ3JhZGllbnQlMjB0ZXh0dXJlfGVufDB8fHx8MTc4NzYwNzIxMnww&ixlib=rb-4.1.0&q=85";

export function AIExplanationPanel({
  title,
  loading,
  children,
  source,
  testId = "ai-explanation-panel",
}) {
  return (
    <div
      data-testid={testId}
      className="relative overflow-hidden rounded-xl border border-blue-100 bg-white"
    >
      <div
        className="absolute inset-x-0 top-0 h-24 opacity-[0.12]"
        style={{
          backgroundImage: `url(${ABSTRACT})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          {source === "fallback" && (
            <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Offline guidance
            </span>
          )}
        </div>
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
            <Spinner /> Generating a plain-language explanation…
          </div>
        ) : (
          <div className="space-y-3 text-[15px] leading-relaxed text-slate-700">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
