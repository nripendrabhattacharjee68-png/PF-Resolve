import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Wallet } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { SectionLabel, Spinner } from "@/components/shared";
import { toast } from "sonner";

function EmployerCard({ label, name, testId }) {
  return (
    <div
      data-testid={testId}
      className="flex-1 rounded-2xl border border-slate-200 bg-white p-7"
    >
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-navy">
          <Building2 className="h-5 w-5" />
        </span>
        <p className="font-heading text-lg font-semibold text-navy">{name}</p>
      </div>
    </div>
  );
}

export default function Review() {
  const { state, submit } = useTransfer();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  if (!state) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submit();
      toast.success("Transfer submitted", {
        description: "Reference PF-DEMO-48291 created.",
      });
      navigate("/transfer/confirmation");
    } catch {
      toast.error("Could not submit the transfer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <SectionLabel>Review</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Review your transfer
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Review the details below before submitting the transfer request.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
        <EmployerCard
          label="From"
          name={state.previous_employer.name}
          testId="review-from-employer"
        />
        <div className="flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
        <EmployerCard
          label="To"
          name={state.current_employer.name}
          testId="review-to-employer"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <SectionLabel>PF balance</SectionLabel>
              <p className="mt-1 font-heading text-2xl font-semibold text-navy">
                {state.balance_formatted}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-heading text-lg font-semibold text-navy">Ready to submit</p>
            <p className="text-sm text-slate-500">All checks have passed.</p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <button
            data-testid="submit-transfer-button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? <Spinner /> : <ArrowRight className="h-4 w-4" />}
            {submitting ? "Submitting…" : "Submit transfer"}
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Prototype simulation — no real government transaction will occur.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
