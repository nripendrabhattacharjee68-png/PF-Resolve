import React from "react";
import { Info } from "lucide-react";

export function DisclosureBanner({ className = "" }) {
  return (
    <div
      data-testid="prototype-disclosure"
      className={`flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white/70 px-4 py-3 text-[13px] leading-relaxed text-slate-600 ${className}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <p>
        <span className="font-semibold text-navy">Prototype environment.</span>{" "}
        This experience uses synthetic data and simulated government-system
        behavior. It is not an official EPFO service and does not perform real
        government transactions.
      </p>
    </div>
  );
}
