# PF Resolve — PRD

## Original Problem Statement
Build "PF Resolve" (Build What Moves India hackathon), a desktop-first, citizen-facing AI-powered web app that helps an Indian employee understand and recover from a blocked/failed PF transfer after a job change. Journey: Diagnose → Explain → Recommend → Fix → Re-check → Submit → Track. Synthetic data only, mock backend, simulated government-system behavior. Not an official EPFO product.

## Architecture
- **Frontend**: React (CRA + craco, `@` alias), Tailwind, framer-motion, lucide-react, sonner. Desktop-first with persistent left sidebar app shell + landing page.
- **Backend**: FastAPI. Clear separation: `server.py` (API), `workflow.py` (deterministic workflow engine + mock EPFO service), `ai_service.py` (OpenAI via Emergent Universal LLM key, gpt-5.4, with deterministic fallbacks), `mock_data.py` (synthetic seed).
- **DB**: MongoDB, single shared demo-state doc (`demo_state`, `_id=rahul-sharma-demo`).
- **AI architecture**: rules engine is source of truth for state; OpenAI only explains/guides/generates language. Never mutates state.

## User Persona
- Rahul Sharma — salaried employee who changed jobs (ABC Technologies → XYZ Digital); PF transfer blocked by DATE_OF_EXIT_MISMATCH.

## Core Requirements (static)
- Full journey completable in-app with seeded synthetic account, no signup.
- Prototype disclosure visible; no real Aadhaar/PAN/UAN/OTP/bank data.
- Deterministic state transitions via real backend endpoints.
- AI enhances but never a single point of failure.

## Implemented (2026-06-24)
- Landing (hero + journey preview, trust props, how-it-works, CTAs).
- App shell: sidebar (Overview, Transfer status, Help), demo account, Prototype badge, Reset demo.
- Overview (summary cards, status card, horizontal timeline).
- Diagnostic (checklist rows, primary problem card, AI explanation panel).
- Resolution (2 steps, AI request generator + copy, "I've fixed it").
- Ready (readiness checklist), Review (employer cards + arrow), Confirmation (ref PF-DEMO-48291), Tracking (processing timeline + AI status explanation).
- Contextual AI assistant (floating panel, grounded in current state).
- Endpoints: /api/demo/account, /api/transfer/{status,check,fix-date-of-exit,submit,timeline}, /api/demo/reset, /api/ai/{explain,generate-request,assistant}.
- Reset demo restores REJECTED / MISMATCH.
- Tested: 100% backend (8/8 pytest) + frontend E2E, zero issues.

## Backlog (P1/P2)
- P2: per-session state isolation (currently single shared demo doc — fine for demo).
- P2: streaming AI responses in assistant.
- P2: development record of Codex contributions doc for submission.
