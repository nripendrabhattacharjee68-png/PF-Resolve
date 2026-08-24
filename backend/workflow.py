"""Deterministic workflow engine + mock EPFO service for PF Resolve.

The rules engine is the single source of truth for transfer state. The OpenAI
model never decides workflow state — it only explains what the engine produces.
"""
from typing import Dict, List

# Human-readable labels for rejection reason codes (no raw codes shown to users)
REJECTION_LABELS = {
    "DATE_OF_EXIT_MISMATCH": "Date of Exit mismatch",
}


def build_checks(state: dict) -> List[dict]:
    """Return the deterministic diagnostic checklist rows."""
    return [
        {"key": "uan", "label": "UAN", "status": state["uan_status"]},
        {
            "key": "current_employment",
            "label": "Current employment",
            "status": state["current_employment_status"],
        },
        {
            "key": "previous_employment",
            "label": "Previous employment",
            "status": state["previous_employment_status"],
        },
        {"key": "kyc", "label": "KYC", "status": state["kyc_status"]},
        {
            "key": "date_of_exit",
            "label": "Date of Exit",
            "status": state["date_of_exit_status"],
        },
    ]


def evaluate_readiness(state: dict) -> dict:
    """Deterministically compute whether the transfer is ready to proceed."""
    checks = build_checks(state)
    blockers = [c for c in checks if c["status"] not in ("VERIFIED",)]
    ready = len(blockers) == 0
    return {
        "checks": checks,
        "ready": ready,
        "readiness": "Ready" if ready else "Blocked",
        "blockers": [b["key"] for b in blockers],
    }


def summary_status(state: dict) -> str:
    """Map internal transfer_status to a citizen-facing summary label."""
    mapping = {
        "REJECTED": "Needs attention",
        "READY": "Ready",
        "SUBMITTED": "Submitted",
        "PROCESSING": "Processing",
    }
    return mapping.get(state["transfer_status"], state["transfer_status"])


def build_timeline(state: dict) -> List[dict]:
    """Return the horizontal timeline stages for the current transfer state.

    Pre-submission the timeline shows the request lifecycle; post-submission it
    shows the processing lifecycle.
    """
    status = state["transfer_status"]

    if status in ("SUBMITTED", "PROCESSING"):
        stages = [
            {"key": "prepared", "label": "Prepared"},
            {"key": "submitted", "label": "Submitted"},
            {"key": "processing", "label": "Processing"},
            {"key": "verification", "label": "Verification"},
            {"key": "completed", "label": "Completed"},
        ]
        # everything up to and including "submitted" is done; processing is current
        order = ["prepared", "submitted", "processing", "verification", "completed"]
        current = "processing"
        current_idx = order.index(current)
        for i, stage in enumerate(stages):
            if i < current_idx:
                stage["state"] = "completed"
            elif i == current_idx:
                stage["state"] = "current"
            else:
                stage["state"] = "upcoming"
        return stages

    # pre-submission lifecycle
    stages = [
        {"key": "request", "label": "Request"},
        {"key": "submitted", "label": "Submitted"},
        {"key": "verification", "label": "Verification"},
        {"key": "transfer", "label": "Transfer"},
    ]
    if status == "REJECTED":
        # stuck at verification with an issue
        states = ["completed", "completed", "issue", "upcoming"]
    else:  # READY
        states = ["completed", "completed", "completed", "current"]
    for stage, s in zip(stages, states):
        stage["state"] = s
    return stages


def public_state(state: dict) -> dict:
    """Shape the internal state into an API-safe payload for the frontend."""
    readiness = evaluate_readiness(state)
    return {
        "user": state["user"],
        "previous_employer": state["previous_employer"],
        "current_employer": state["current_employer"],
        "balance": state["balance"],
        "balance_formatted": f"₹{state['balance']:,}",
        "transfer_status": state["transfer_status"],
        "summary_status": summary_status(state),
        "rejection_reason": state["rejection_reason"],
        "rejection_label": REJECTION_LABELS.get(state["rejection_reason"]) if state["rejection_reason"] else None,
        "reference_number": state["reference_number"],
        "date_of_exit_status": state["date_of_exit_status"],
        "checks": readiness["checks"],
        "ready": readiness["ready"],
        "readiness": readiness["readiness"],
        "timeline": build_timeline(state),
    }


# ---- Mock EPFO service: deterministic state transitions ----

def apply_fix_date_of_exit(state: dict) -> dict:
    """Simulated employer correction: MISMATCH -> VERIFIED, re-run readiness."""
    state["date_of_exit_status"] = "VERIFIED"
    readiness = evaluate_readiness(state)
    if readiness["ready"]:
        state["transfer_status"] = "READY"
        state["rejection_reason"] = None
    return state


def apply_submit(state: dict) -> dict:
    """Submit a READY transfer: READY -> SUBMITTED -> PROCESSING."""
    from mock_data import REFERENCE_NUMBER

    state["transfer_status"] = "PROCESSING"
    state["reference_number"] = REFERENCE_NUMBER
    return state
