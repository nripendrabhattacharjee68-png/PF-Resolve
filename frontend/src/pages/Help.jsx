import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw, ShieldCheck, MessageSquare } from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { SectionLabel, Spinner } from "@/components/shared";
import { DisclosureBanner } from "@/components/DisclosureBanner";
import { toast } from "sonner";

const FAQS = [
  {
    q: "What is a PF transfer?",
    a: "When you change jobs, your Provident Fund balance from your previous employer can be moved to your account with the new employer. PF Resolve helps when that move gets blocked.",
  },
  {
    q: "What is Date of Exit?",
    a: "It's the official last working day recorded for your previous employment. It must be correct before your PF balance can be transferred.",
  },
  {
    q: "Is this a real EPFO service?",
    a: "No. PF Resolve is a hackathon prototype using synthetic data and simulated government-system behavior. It does not perform real government transactions.",
  },
];

export default function Help() {
  const { reset } = useTransfer();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await reset();
      toast.success("Demo reset", {
        description: "The transfer is blocked again — ready for a fresh run.",
      });
      navigate("/transfer");
    } finally {
      setResetting(false);
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
        <SectionLabel>Support</SectionLabel>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-navy lg:text-4xl">
          Help & FAQs
        </h1>
        <p className="mt-2 text-[15px] text-slate-600">
          Common questions about your PF transfer and this prototype.
        </p>
      </div>

      <DisclosureBanner />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {FAQS.map((f) => (
            <div
              key={f.q}
              data-testid={`faq-${f.q.slice(0, 8)}`}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-navy">{f.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
            </div>
          ))}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
            <MessageSquare className="mt-0.5 h-5 w-5 text-blue-600" />
            <p className="text-[15px] leading-relaxed text-slate-700">
              Have a specific question? Use the{" "}
              <span className="font-semibold text-navy">Ask about your transfer</span>{" "}
              assistant in the bottom-right corner — it answers using your current
              transfer record.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold text-navy">
              Demo controls
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Reset the demo to restore the original blocked transfer so you can
              walk through the full journey again.
            </p>
            <button
              data-testid="help-reset-demo-button"
              onClick={handleReset}
              disabled={resetting}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy disabled:opacity-60"
            >
              {resetting ? <Spinner /> : <RotateCcw className="h-4 w-4" />}
              {resetting ? "Resetting…" : "Reset demo"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
