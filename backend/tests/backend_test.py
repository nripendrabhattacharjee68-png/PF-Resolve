"""PF Resolve backend API tests."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://pf-recover.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"


@pytest.fixture(scope="module", autouse=True)
def reset_before_and_after():
    requests.post(f"{API}/demo/reset", timeout=30)
    yield
    requests.post(f"{API}/demo/reset", timeout=30)


@pytest.fixture
def reset_state():
    requests.post(f"{API}/demo/reset", timeout=30)


# ---- Account & status ----
def test_demo_account(reset_state):
    r = requests.get(f"{API}/demo/account", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["user"]["name"] == "Rahul Sharma"
    assert d["balance"] == 184520
    for k in ("uan_status", "kyc_status", "previous_employment_status", "current_employment_status"):
        assert d[k] == "VERIFIED", f"{k}={d[k]}"


def test_transfer_status_rejected(reset_state):
    r = requests.get(f"{API}/transfer/status", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["transfer_status"] == "REJECTED"
    assert d["readiness"] == "Blocked"
    doe = next(c for c in d["checks"] if c["key"] == "date_of_exit")
    assert doe["status"] == "MISMATCH"
    assert any(s.get("state") == "issue" for s in d["timeline"])


# ---- AI endpoints (either 'ai' or 'fallback' acceptable) ----
def test_ai_explain_rejection():
    r = requests.post(f"{API}/ai/explain", json={"kind": "rejection"}, timeout=60)
    assert r.status_code == 200
    d = r.json()
    assert "meaning" in d and "action" in d
    assert d["meaning"] and d["action"]


def test_ai_explain_status():
    r = requests.post(f"{API}/ai/explain", json={"kind": "status"}, timeout=60)
    assert r.status_code == 200
    d = r.json()
    assert "explanation" in d and d["explanation"]


def test_ai_generate_request():
    r = requests.post(f"{API}/ai/generate-request", timeout=60)
    assert r.status_code == 200
    d = r.json()
    assert "subject" in d and "body" in d
    assert d["subject"] and d["body"]


def test_ai_assistant():
    r = requests.post(f"{API}/ai/assistant", json={"question": "Why was my transfer rejected?"}, timeout=60)
    assert r.status_code == 200
    d = r.json()
    assert "answer" in d and d["answer"]


# ---- State transitions ----
def test_submit_rejects_when_not_ready(reset_state):
    r = requests.post(f"{API}/transfer/submit", timeout=30)
    assert r.status_code == 400


def test_fix_then_submit_then_reset(reset_state):
    # fix
    r = requests.post(f"{API}/transfer/fix-date-of-exit", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["date_of_exit_status"] == "VERIFIED"
    assert d["transfer_status"] == "READY"
    assert d.get("notification")

    # verify persistence via GET
    d2 = requests.get(f"{API}/transfer/status", timeout=30).json()
    assert d2["transfer_status"] == "READY"
    assert d2["readiness"] == "Ready"

    # submit
    r = requests.post(f"{API}/transfer/submit", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["transfer_status"] == "PROCESSING"
    assert d["reference_number"] == "PF-DEMO-48291"

    # reset
    r = requests.post(f"{API}/demo/reset", timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert d["transfer_status"] == "REJECTED"
    assert d["date_of_exit_status"] == "MISMATCH"
    assert d["rejection_reason"] == "DATE_OF_EXIT_MISMATCH"
    assert d["reference_number"] is None
