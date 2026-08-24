import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, ShieldQuestion } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { api } from "@/lib/api";
import { CheckRow, StatusPill, SectionLabel } from "@/components/shared";
import { AIExplanationPanel } from "@/components/AIExplanationPanel";

export default function Diagnostic() {
  const { state } = useTransfer();
  const navigate = useNavigate();
  const [explain, setExplain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .explain("rejection")
      .then((d) => alive && setExplain(d))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (!state) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <SectionLabel>Diagnostic</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Let's find out what went wrong.
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          We checked the information available in your transfer record.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Diagnostic panel */}
        <div className="lg:col-span-3">
          <div
            data-testid="diagnostic-panel"
            className="rounded-2xl border border-slate-200 bg-white p-7"
          >
            <div className="divide-y divide-slate-100">
              {state.checks.map((c) => (
                <CheckRow
                  key={c.key}
                  label={c.label}
                  status={c.status}
                  testId={`diagnostic-row-${c.key}`}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4">
              <span className="text-sm font-semibold text-navy">
                Transfer readiness
              </span>
              <StatusPill
                status={state.readiness}
                testId="diagnostic-readiness"
              />
            </div>
          </div>
        </div>

        {/* Primary problem */}
        <div className="lg:col-span-2">
          <div
            data-testid="primary-problem-card"
            className="h-full rounded-2xl border border-amber-200 bg-amber-50/60 p-7"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-heading text-xl font-semibold text-navy">
              Date of Exit mismatch
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
              The Date of Exit information associated with your previous
              employment record does not currently match the information
              required for this transfer.
            </p>
          </div>
        </div>
      </div>

      {/* AI explanation */}
      <AIExplanationPanel
        title="What does this mean?"
        loading={loading}
        source={explain?.source}
        testId="ai-explanation-meaning"
      >
        <p data-testid="ai-explanation-text">{explain?.meaning}</p>
        <div className="pt-2">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <ShieldQuestion className="h-4 w-4 text-blue-600" /> What should I do?
          </p>
          <p className="mt-1" data-testid="ai-explanation-action">
            {explain?.action}
          </p>
        </div>
        <div className="pt-3">
          <button
            data-testid="show-me-what-to-do-button"
            onClick={() => navigate("/transfer/resolution")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Show me what to do <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AIExplanationPanel>
    </motion.div>
  );
}
