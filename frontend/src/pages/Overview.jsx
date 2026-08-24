import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Wallet, AlertTriangle, ArrowUpRight } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { Timeline } from "@/components/Timeline";
import { StatusPill, SectionLabel } from "@/components/shared";
import { DisclosureBanner } from "@/components/DisclosureBanner";

function SummaryCard({ label, value, icon: Icon, testId, accent }) {
  return (
    <div
      data-testid={testId}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent || "text-slate-400"}`} />
        <SectionLabel>{label}</SectionLabel>
      </div>
      <p className="mt-3 font-heading text-lg font-semibold text-navy">{value}</p>
    </div>
  );
}

export default function Overview() {
  const { state } = useTransfer();
  const navigate = useNavigate();
  if (!state) return null;

  const isReady = state.transfer_status === "READY";
  const isSubmitted = ["SUBMITTED", "PROCESSING"].includes(state.transfer_status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <SectionLabel>Overview</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Your PF transfer
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Here's what's happening with your transfer.
        </p>
      </div>

      <DisclosureBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Previous employer"
          value={state.previous_employer.name}
          icon={Building2}
          testId="summary-previous-employer"
        />
        <SummaryCard
          label="Current employer"
          value={state.current_employer.name}
          icon={ArrowUpRight}
          testId="summary-current-employer"
        />
        <SummaryCard
          label="PF balance"
          value={state.balance_formatted}
          icon={Wallet}
          testId="summary-pf-balance"
          accent="text-blue-500"
        />
        <div
          data-testid="summary-status"
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <SectionLabel>Status</SectionLabel>
          <div className="mt-3">
            <StatusPill status={state.summary_status} testId="summary-status-pill" />
          </div>
        </div>
      </div>

      {/* Status card */}
      <div
        data-testid="transfer-status-card"
        className="rounded-2xl border border-slate-200 bg-white p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              {!isReady && !isSubmitted && (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                </span>
              )}
              <h2 className="font-heading text-2xl font-semibold text-navy">
                {isSubmitted
                  ? "Your transfer is being processed"
                  : isReady
                  ? "Your transfer is ready"
                  : "Transfer needs attention"}
              </h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              {isSubmitted
                ? "Your transfer request has been submitted and is now processing."
                : isReady
                ? "The issue has been resolved and your transfer can now continue."
                : "Your transfer could not continue because we found an issue with your previous employment record."}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SectionLabel>Status</SectionLabel>
              <StatusPill
                status={state.transfer_status === "REJECTED" ? "REJECTED" : state.summary_status}
                label={state.transfer_status === "REJECTED" ? "Rejected" : state.summary_status}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-64">
            {!isReady && !isSubmitted && (
              <button
                data-testid="understand-issue-button"
                onClick={() => navigate("/transfer/diagnostic")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Understand the issue <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {isReady && (
              <button
                data-testid="continue-transfer-button"
                onClick={() => navigate("/transfer/review")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Continue transfer <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {isSubmitted && (
              <button
                data-testid="track-transfer-button"
                onClick={() => navigate("/transfer/tracking")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Track transfer <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <button
              data-testid="view-details-button"
              onClick={() => navigate("/transfer/diagnostic")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy"
            >
              View transfer details
            </button>
          </div>
        </div>

        <div className="mt-9 border-t border-slate-100 pt-8">
          <SectionLabel className="mb-6 block">Transfer timeline</SectionLabel>
          <Timeline stages={state.timeline} />
        </div>
      </div>
    </motion.div>
  );
}
