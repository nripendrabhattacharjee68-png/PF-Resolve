import React from "react";
import { CheckCircle2, AlertTriangle, Circle, Loader2 } from "lucide-react";

export function SectionLabel({ children, className = "" }) {
  return (
    <span
      className={`text-xs font-semibold tracking-[0.14em] uppercase text-slate-500 ${className}`}
    >
      {children}
    </span>
  );
}

const STATUS_STYLES = {
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  MISMATCH: "bg-amber-50 text-amber-700 border-amber-100",
  READY: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-100",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  "Needs attention": "bg-amber-50 text-amber-700 border-amber-100",
  Blocked: "bg-red-50 text-red-700 border-red-100",
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-blue-50 text-blue-700 border-blue-100",
  Submitted: "bg-blue-50 text-blue-700 border-blue-100",
};

export function StatusPill({ status, label, testId }) {
  const cls = STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      data-testid={testId}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {label || status}
    </span>
  );
}

export function CheckRow({ label, status, testId }) {
  const verified = status === "VERIFIED";
  return (
    <div
      data-testid={testId}
      className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
    >
      <span className="text-[15px] font-medium text-navy">{label}</span>
      {verified ? (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <CheckCircle2 className="h-[18px] w-[18px]" /> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600">
          <AlertTriangle className="h-[18px] w-[18px]" /> Needs attention
        </span>
      )}
    </div>
  );
}

export function Spinner({ className = "" }) {
  return <Loader2 className={`h-4 w-4 animate-spin ${className}`} />;
}

export function PrototypeBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 ${className}`}
    >
      Prototype
    </span>
  );
}
