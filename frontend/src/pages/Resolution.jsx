import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Copy, Check, RefreshCw, ArrowRight, Mail } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { api } from "@/lib/api";
import { SectionLabel, Spinner } from "@/components/shared";
import { toast } from "sonner";

export default function Resolution() {
  const { fixDateOfExit } = useTransfer();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fixing, setFixing] = useState(false);

  const generate = async () => {
    setGenLoading(true);
    try {
      const r = await api.generateRequest();
      setRequest(r);
    } catch {
      toast.error("Could not generate the request. Please try again.");
    } finally {
      setGenLoading(false);
    }
  };

  const copy = async () => {
    if (!request) return;
    const text = `Subject: ${request.subject}\n\n${request.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Request copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFixed = async () => {
    setFixing(true);
    try {
      const res = await fixDateOfExit();
      toast.success("Demo simulation", {
        description: "The employment record has been updated.",
      });
      if (res.ready) {
        navigate("/transfer/ready");
      } else {
        navigate("/transfer/diagnostic");
      }
    } catch {
      toast.error("Something went wrong updating the record.");
    } finally {
      setFixing(false);
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
        <SectionLabel>Resolution</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Let's fix the problem.
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Here's the action needed before you can continue your transfer.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Step 1 */}
        <div
          data-testid="resolution-step-1"
          className="rounded-2xl border border-slate-200 bg-white p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white">
              1
            </span>
            <h2 className="font-heading text-xl font-semibold text-navy">
              Ask your previous employer to verify your Date of Exit.
            </h2>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Your previous employer needs to verify the employment record before
            the transfer can continue.
          </p>
          {!request && (
            <button
              data-testid="generate-request-button"
              onClick={generate}
              disabled={genLoading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-60"
            >
              {genLoading ? <Spinner /> : <FileText className="h-4 w-4" />}
              {genLoading ? "Generating request…" : "Generate request"}
            </button>
          )}
        </div>

        {/* Step 2 */}
        <div
          data-testid="resolution-step-2"
          className="rounded-2xl border border-slate-200 bg-white p-7"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-sm font-semibold text-slate-600">
              2
            </span>
            <h2 className="font-heading text-xl font-semibold text-navy">
              Return after the record is corrected.
            </h2>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Once the record is updated, PF Resolve will re-check your transfer.
          </p>
          <button
            data-testid="ive-fixed-it-button"
            onClick={handleFixed}
            disabled={fixing}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy disabled:opacity-60"
          >
            {fixing ? <Spinner /> : <RefreshCw className="h-4 w-4" />}
            {fixing ? "Re-checking…" : "I've fixed it"}
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Demo simulation — this updates the mock employment record.
          </p>
        </div>
      </div>

      {/* Generated request */}
      {request && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="generated-request-card"
          className="rounded-2xl border border-slate-200 bg-white p-7"
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <SectionLabel>Request to previous employer</SectionLabel>
            {request.source === "fallback" && (
              <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Offline template
              </span>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-navy">
              Subject: <span data-testid="request-subject">{request.subject}</span>
            </p>
            <p
              data-testid="request-body"
              className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700"
            >
              {request.body}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              data-testid="copy-request-button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy request"}
            </button>
            <button
              data-testid="request-done-button"
              onClick={handleFixed}
              disabled={fixing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy disabled:opacity-60"
            >
              {fixing ? <Spinner /> : <ArrowRight className="h-4 w-4" />}
              Done — I've fixed it
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
