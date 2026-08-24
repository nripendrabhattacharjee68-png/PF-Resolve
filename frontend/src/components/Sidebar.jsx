import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  LifeBuoy,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useTransfer } from "@/context/TransferContext";
import { PrototypeBadge } from "@/components/shared";
import { toast } from "sonner";

const AVATAR =
  "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODc2MDcyMTN8MA&ixlib=rb-4.1.0&q=85";

const navItem = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
    isActive
      ? "bg-navy text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-navy"
  }`;

export function Sidebar() {
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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-cream">
      <div className="flex items-center gap-2 px-6 py-6">
        <NavLink to="/" className="flex items-center gap-2" data-testid="sidebar-logo">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <span className="font-heading text-lg font-semibold text-navy">
            PF Resolve
          </span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-6 px-4">
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Transfer
          </p>
          <div className="space-y-1">
            <NavLink to="/transfer" end className={navItem} data-testid="nav-overview">
              <LayoutDashboard className="h-[18px] w-[18px]" />
              Overview
            </NavLink>
            <NavLink to="/transfer/tracking" className={navItem} data-testid="nav-status">
              <Activity className="h-[18px] w-[18px]" />
              Transfer status
            </NavLink>
          </div>
        </div>
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Support
          </p>
          <div className="space-y-1">
            <NavLink to="/transfer/help" className={navItem} data-testid="nav-help">
              <LifeBuoy className="h-[18px] w-[18px]" />
              Help
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-100">
          <img
            src={AVATAR}
            alt="Rahul Sharma"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-navy">Rahul Sharma</p>
            <p className="text-[11px] text-slate-500">Demo account</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <PrototypeBadge />
          <button
            data-testid="reset-demo-button"
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-navy disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${resetting ? "animate-spin" : ""}`} />
            Reset demo
          </button>
        </div>
      </div>
    </aside>
  );
}
