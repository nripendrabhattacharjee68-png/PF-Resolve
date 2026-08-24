import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { SectionLabel } from "@/components/shared";

function DetailRow({ label, value, testId }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
      <SectionLabel>{label}</SectionLabel>
      <span data-testid={testId} className="text-[15px] font-semibold text-navy">
        {value}
      </span>
    </div>
  );
}

export default function Confirmation() {
  const { state } = useTransfer();
  const navigate = useNavigate();
  if (!state) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl space-y-8"
    >
      <div className="text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
        >
          <CheckCircle2 className="h-9 w-9" />
        </motion.span>
        <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Transfer request submitted
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Your simulated transfer request has been submitted successfully.
        </p>
      </div>

      <div
        data-testid="confirmation-details"
        className="rounded-2xl border border-slate-200 bg-white p-7"
      >
        <DetailRow
          label="Reference"
          value={state.reference_number}
          testId="confirmation-reference"
        />
        <DetailRow
          label="Amount"
          value={state.balance_formatted}
          testId="confirmation-amount"
        />
        <DetailRow
          label="From"
          value={state.previous_employer.name}
          testId="confirmation-from"
        />
        <DetailRow
          label="To"
          value={state.current_employer.name}
          testId="confirmation-to"
        />
      </div>

      <div className="flex justify-center">
        <button
          data-testid="track-transfer-confirmation-button"
          onClick={() => navigate("/transfer/tracking")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Track transfer <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Prototype simulation — no real government transaction occurred.
      </p>
    </motion.div>
  );
}
