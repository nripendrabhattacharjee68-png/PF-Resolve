import React from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";

const NODE = {
  completed: {
    ring: "border-emerald-500 bg-emerald-500 text-white",
    line: "bg-emerald-500",
    text: "text-navy",
  },
  current: {
    ring: "border-blue-500 bg-blue-500 text-white ring-4 ring-blue-100",
    line: "bg-slate-200",
    text: "text-navy",
  },
  issue: {
    ring: "border-amber-500 bg-amber-500 text-white",
    line: "bg-slate-200",
    text: "text-amber-700",
  },
  upcoming: {
    ring: "border-slate-300 bg-white text-slate-400",
    line: "bg-slate-200",
    text: "text-slate-400",
  },
};

export function Timeline({ stages, testId = "transfer-timeline" }) {
  return (
    <div data-testid={testId} className="w-full overflow-x-auto thin-scroll">
      <div className="flex min-w-[560px] items-start">
        {stages.map((stage, i) => {
          const style = NODE[stage.state] || NODE.upcoming;
          const isLast = i === stages.length - 1;
          return (
            <div key={stage.key} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="flex-1" />
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${style.ring}`}
                >
                  {stage.state === "completed" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : stage.state === "issue" ? (
                    <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
                  ) : stage.state === "current" ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </motion.div>
                {!isLast && (
                  <div className="relative flex-1">
                    <div className="h-[2px] w-full bg-slate-200" />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: stage.state === "completed" ? 1 : 0 }}
                      transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                      style={{ originX: 0 }}
                      className="absolute inset-0 h-[2px] bg-emerald-500"
                    />
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-col items-center px-2 text-center">
                <span className={`text-sm font-semibold ${style.text}`}>
                  {stage.label}
                </span>
                {stage.state === "issue" && (
                  <span className="mt-0.5 text-xs font-medium text-amber-600">
                    Issue found
                  </span>
                )}
                {stage.state === "current" && (
                  <span className="mt-0.5 text-xs font-medium text-blue-600">
                    In progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
