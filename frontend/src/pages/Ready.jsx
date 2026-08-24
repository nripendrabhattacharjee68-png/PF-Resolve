import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { SectionLabel, StatusPill } from "@/components/shared";

export default function Ready() {
  const { state } = useTransfer();
  const navigate = useNavigate();
  if (!state) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <SectionLabel>Resolved</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Your transfer is ready.
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          The issue has been resolved and your transfer can now continue.
        </p>
      </div>

      <div
        data-testid="readiness-panel"
        className="rounded-2xl border border-emerald-200 bg-white p-8"
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-1">
              {state.checks.map((c) => (
                <div
                  key={c.key}
                  data-testid={`ready-check-${c.key}`}
                  className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-[15px] font-medium text-navy">
                    {c.label} verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-slate-50 p-6">
            <div>
              <SectionLabel>Transfer readiness</SectionLabel>
              <div className="mt-3">
                <StatusPill status="Ready" testId="ready-status-pill" />
              </div>
              <div className="mt-6">
                <SectionLabel>PF balance</SectionLabel>
                <p className="mt-2 font-heading text-2xl font-semibold text-navy">
                  {state.balance_formatted}
                </p>
              </div>
            </div>
            <button
              data-testid="continue-transfer-ready-button"
              onClick={() => navigate("/transfer/review")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Continue transfer <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
