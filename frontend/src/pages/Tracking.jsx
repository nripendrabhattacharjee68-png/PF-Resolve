import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { api } from "@/lib/api";
import { Timeline } from "@/components/Timeline";
import { SectionLabel, StatusPill } from "@/components/shared";
import { AIExplanationPanel } from "@/components/AIExplanationPanel";

export default function Tracking() {
  const { state } = useTransfer();
  const navigate = useNavigate();
  const [explain, setExplain] = useState(null);
  const [loading, setLoading] = useState(true);

  const submitted = state && ["SUBMITTED", "PROCESSING"].includes(state.transfer_status);

  useEffect(() => {
    if (!submitted) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    api
      .explain("status")
      .then((d) => alive && setExplain(d))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [submitted]);

  if (!state) return null;

  if (!submitted) {
    return (
      <div className="space-y-6">
        <div>
          <SectionLabel>Transfer status</SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
            No active transfer yet
          </h1>
          <p className="mt-2 text-[15px] text-slate-600">
            Once you submit your transfer, you'll be able to track its progress
            here.
          </p>
        </div>
        <button
          data-testid="tracking-go-overview-button"
          onClick={() => navigate("/transfer")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Go to overview
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <SectionLabel>Transfer status</SectionLabel>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
            Processing
          </h1>
          <StatusPill status="Processing" testId="tracking-status-pill" />
        </div>
        <p className="mt-2 text-[15px] text-slate-600">
          Reference{" "}
          <span className="font-semibold text-navy" data-testid="tracking-reference">
            {state.reference_number}
          </span>{" "}
          · {state.balance_formatted}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="mb-8 flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <SectionLabel>Progress</SectionLabel>
        </div>
        <Timeline stages={state.timeline} testId="tracking-timeline" />
      </div>

      <AIExplanationPanel
        title='What does "Processing" mean?'
        loading={loading}
        source={explain?.source}
        testId="ai-status-explanation"
      >
        <p data-testid="ai-status-text">{explain?.explanation}</p>
      </AIExplanationPanel>
    </motion.div>
  );
}
