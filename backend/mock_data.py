"""Synthetic seed data for the PF Resolve prototype.

All data here is fake and used only to simulate a blocked PF transfer journey
for the "Build What Moves India" hackathon demo. Nothing connects to real EPFO
systems.
"""

REFERENCE_NUMBER = "PF-DEMO-48291"

DEMO_STATE_ID = "rahul-sharma-demo"


def initial_state() -> dict:
    """Return a fresh copy of the seeded demo transfer state (REJECTED)."""
    return {
        "_id": DEMO_STATE_ID,
        "user": {
            "id": "user-rahul",
            "name": "Rahul Sharma",
            "synthetic_uan": "1000••••••42",
        },
        "previous_employer": {
            "id": "emp-abc",
            "name": "ABC Technologies Pvt. Ltd.",
            "joining_date": "2019-06-01",
            "exit_date": "2023-03-31",
        },
        "current_employer": {
            "id": "emp-xyz",
            "name": "XYZ Digital Pvt. Ltd.",
            "joining_date": "2023-04-15",
        },
        "balance": 184520,
        # deterministic verification checks
        "uan_status": "VERIFIED",
        "kyc_status": "VERIFIED",
        "previous_employment_status": "VERIFIED",
        "current_employment_status": "VERIFIED",
        "date_of_exit_status": "MISMATCH",
        # transfer workflow
        "transfer_status": "REJECTED",
        "rejection_reason": "DATE_OF_EXIT_MISMATCH",
        "reference_number": None,
    }
