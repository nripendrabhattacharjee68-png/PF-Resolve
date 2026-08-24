"""AI service for PF Resolve.

Wraps the Emergent LLM key (OpenAI gpt-5.4) via emergentintegrations. Every
function has a deterministic fallback so the demo never breaks if the AI API is
unavailable. The AI only explains / generates language — it never decides
workflow state.
"""
import os
import json
import uuid
import logging

logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "openai"
MODEL_NAME = "gpt-5.4"


def _context_line(state: dict) -> str:
    return (
        f"Citizen: {state['user']['name']} (synthetic UAN {state['user']['synthetic_uan']}). "
        f"Previous employer: {state['previous_employer']['name']}. "
        f"Current employer: {state['current_employer']['name']}. "
        f"PF balance: ₹{state['balance']:,}. "
        f"Transfer status: {state['transfer_status']}. "
        f"Rejection reason: {state['rejection_reason']}. "
        f"Date of Exit status: {state['date_of_exit_status']}. "
        f"Checks -> UAN:{state['uan_status']}, KYC:{state['kyc_status']}, "
        f"Previous employment:{state['previous_employment_status']}, "
        f"Current employment:{state['current_employment_status']}."
    )


async def _run(system_message: str, user_text: str) -> str:
    """Call the LLM once (non-streaming). Raises on failure so caller can fall back."""
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"pf-resolve-{uuid.uuid4()}",
        system_message=system_message,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    resp = await chat.send_message(UserMessage(text=user_text))
    return resp if isinstance(resp, str) else str(resp)


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end != -1:
        text = text[start : end + 1]
    return json.loads(text)


# ---------------- Deterministic fallbacks ----------------

def _fallback_explain_rejection(state: dict) -> dict:
    return {
        "meaning": (
            "Your PF transfer is blocked because the employment record from your "
            "previous company has a Date of Exit issue. This information is needed "
            "to establish the end of your previous employment before the transfer "
            "can proceed. You don't need to start the transfer again right now."
        ),
        "action": (
            "Ask your previous employer to verify or correct the Date of Exit "
            "associated with your employment record."
        ),
        "source": "fallback",
    }


def _fallback_explain_status(state: dict) -> dict:
    return {
        "explanation": (
            "Your transfer request has been submitted and is currently in the "
            "processing stage. What you need to do: nothing right now. You can "
            "return here to see the next stage of the transfer."
        ),
        "source": "fallback",
    }


def _fallback_request(state: dict) -> dict:
    return {
        "subject": "Request to verify Date of Exit for PF transfer",
        "body": (
            "Hello,\n\n"
            "I am requesting you to verify the Date of Exit associated with my "
            "previous employment record so that I can complete my PF transfer.\n\n"
            "Please let me know if any additional information is required.\n\n"
            "Thank you."
        ),
        "source": "fallback",
    }


def _fallback_assistant(question: str, state: dict) -> dict:
    q = (question or "").lower()
    if "reject" in q or "why" in q:
        answer = (
            "Your transfer was flagged because the Date of Exit on your previous "
            "employment record does not match what's needed for the transfer. "
            "Once your previous employer verifies it, you can continue."
        )
    elif "date of exit" in q:
        answer = (
            "Date of Exit is the official last working day recorded for your "
            "previous employment. EPFO uses it to confirm your previous job ended "
            "before moving your PF balance."
        )
    elif "employer" in q or "ask" in q:
        answer = (
            "Ask your previous employer to verify or correct the Date of Exit on "
            "your EPFO employment record. You can use the request PF Resolve "
            "generates for you."
        )
    elif "submit" in q or "continue" in q:
        if state["transfer_status"] == "READY":
            answer = "Yes — all checks have passed and your transfer is ready to submit."
        else:
            answer = (
                "Not yet. The Date of Exit issue needs to be resolved first. After "
                "that, PF Resolve will re-check and let you submit."
            )
    else:
        answer = (
            "I can help you understand your PF transfer. Your transfer is currently "
            f"'{state['transfer_status']}'. Ask me why it was rejected or what to do next."
        )
    return {"answer": answer, "source": "fallback"}


# ---------------- Public API ----------------

async def explain_rejection(state: dict) -> dict:
    if not EMERGENT_LLM_KEY:
        return _fallback_explain_rejection(state)
    try:
        system = (
            "You are PF Resolve, a calm, trustworthy assistant that helps Indian "
            "employees understand a blocked PF (Provident Fund) transfer. Explain in "
            "plain, simple English. Do NOT invent government rules, timelines, or "
            "account data beyond what is provided. Do NOT show raw status codes. "
            "Return ONLY JSON: {\"meaning\": string, \"action\": string}. "
            "'meaning' = 2-3 short sentences explaining why the transfer is blocked. "
            "'action' = one sentence on the single next step."
        )
        user = _context_line(state) + "\nExplain why the transfer is blocked and the recommended action."
        data = _extract_json(await _run(system, user))
        return {
            "meaning": str(data["meaning"]),
            "action": str(data["action"]),
            "source": "ai",
        }
    except Exception as e:  # noqa: BLE001
        logger.warning(f"explain_rejection AI failed, using fallback: {e}")
        return _fallback_explain_rejection(state)


async def explain_status(state: dict) -> dict:
    if not EMERGENT_LLM_KEY:
        return _fallback_explain_status(state)
    try:
        system = (
            "You are PF Resolve. Explain the current PF transfer processing status "
            "in plain English. Do NOT invent timelines or dates. Reassure the citizen "
            "about what (if anything) they need to do. Return ONLY JSON: "
            "{\"explanation\": string} (2-3 short sentences)."
        )
        user = _context_line(state) + "\nExplain what the current 'Processing' status means."
        data = _extract_json(await _run(system, user))
        return {"explanation": str(data["explanation"]), "source": "ai"}
    except Exception as e:  # noqa: BLE001
        logger.warning(f"explain_status AI failed, using fallback: {e}")
        return _fallback_explain_status(state)


async def generate_request(state: dict) -> dict:
    if not EMERGENT_LLM_KEY:
        return _fallback_request(state)
    try:
        system = (
            "You are PF Resolve. Write a concise, polite, professional message from "
            "an employee to their PREVIOUS employer asking them to verify/correct the "
            "Date of Exit on the employee's EPFO employment record so a PF transfer "
            "can proceed. Keep it short (4-6 lines). Do NOT include real personal data, "
            "Aadhaar, PAN, or bank details. Return ONLY JSON: "
            "{\"subject\": string, \"body\": string}."
        )
        user = _context_line(state) + "\nGenerate the employer request."
        data = _extract_json(await _run(system, user))
        return {
            "subject": str(data["subject"]),
            "body": str(data["body"]),
            "source": "ai",
        }
    except Exception as e:  # noqa: BLE001
        logger.warning(f"generate_request AI failed, using fallback: {e}")
        return _fallback_request(state)


async def assistant_answer(question: str, state: dict) -> dict:
    if not EMERGENT_LLM_KEY:
        return _fallback_assistant(question, state)
    try:
        system = (
            "You are the PF Resolve assistant. Answer the citizen's question about "
            "their PF transfer using ONLY the structured context provided. Never "
            "invent account numbers, balances, dates, timelines, or government rules. "
            "If asked something outside this transfer, gently redirect. Keep answers "
            "to 2-4 short sentences in plain English. Return ONLY JSON: "
            "{\"answer\": string}."
        )
        user = f"Transfer context:\n{_context_line(state)}\n\nCitizen question: {question}"
        data = _extract_json(await _run(system, user))
        return {"answer": str(data["answer"]), "source": "ai"}
    except Exception as e:  # noqa: BLE001
        logger.warning(f"assistant_answer AI failed, using fallback: {e}")
        return _fallback_assistant(question, state)
