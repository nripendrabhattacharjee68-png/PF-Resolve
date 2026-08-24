from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import workflow
import ai_service
from mock_data import initial_state, DEMO_STATE_ID

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="PF Resolve API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- state helpers ----------
async def get_state() -> dict:
    doc = await db.demo_state.find_one({"_id": DEMO_STATE_ID})
    if not doc:
        doc = initial_state()
        await db.demo_state.insert_one(doc)
    return doc


async def save_state(state: dict) -> None:
    await db.demo_state.replace_one({"_id": DEMO_STATE_ID}, state, upsert=True)


# ---------- request models ----------
class AssistantQuery(BaseModel):
    question: str


class ExplainQuery(BaseModel):
    kind: Optional[str] = "rejection"  # "rejection" | "status"


# ---------- routes ----------
@api_router.get("/")
async def root():
    return {"message": "PF Resolve API", "prototype": True}


@api_router.get("/demo/account")
async def demo_account():
    state = await get_state()
    ps = workflow.public_state(state)
    return {
        "user": ps["user"],
        "previous_employer": ps["previous_employer"],
        "current_employer": ps["current_employer"],
        "balance": ps["balance"],
        "balance_formatted": ps["balance_formatted"],
        "kyc_status": state["kyc_status"],
        "uan_status": state["uan_status"],
        "previous_employment_status": state["previous_employment_status"],
        "current_employment_status": state["current_employment_status"],
        "prototype": True,
    }


@api_router.get("/transfer/status")
async def transfer_status():
    state = await get_state()
    return workflow.public_state(state)


@api_router.post("/transfer/check")
async def transfer_check():
    """Re-run the deterministic readiness check against the mock EPFO service."""
    state = await get_state()
    readiness = workflow.evaluate_readiness(state)
    return workflow.public_state(state) | {"checked": True}


@api_router.get("/transfer/timeline")
async def transfer_timeline():
    state = await get_state()
    return {"timeline": workflow.build_timeline(state), "transfer_status": state["transfer_status"]}


@api_router.post("/transfer/fix-date-of-exit")
async def fix_date_of_exit():
    state = await get_state()
    if state["date_of_exit_status"] == "VERIFIED":
        return workflow.public_state(state) | {"already_fixed": True}
    state = workflow.apply_fix_date_of_exit(state)
    await save_state(state)
    return workflow.public_state(state) | {
        "notification": "Demo simulation: the employment record has been updated.",
    }


@api_router.post("/transfer/submit")
async def submit_transfer():
    state = await get_state()
    if state["transfer_status"] != "READY":
        raise HTTPException(status_code=400, detail="Transfer is not ready to submit.")
    state = workflow.apply_submit(state)
    await save_state(state)
    return workflow.public_state(state)


@api_router.post("/demo/reset")
async def reset_demo():
    state = initial_state()
    await save_state(state)
    return workflow.public_state(state) | {"notification": "Demo reset. The transfer is blocked again."}


# ---------- AI routes ----------
@api_router.post("/ai/explain")
async def ai_explain(query: ExplainQuery):
    state = await get_state()
    if query.kind == "status":
        return await ai_service.explain_status(state)
    return await ai_service.explain_rejection(state)


@api_router.post("/ai/generate-request")
async def ai_generate_request():
    state = await get_state()
    return await ai_service.generate_request(state)


@api_router.post("/ai/assistant")
async def ai_assistant(query: AssistantQuery):
    state = await get_state()
    return await ai_service.assistant_answer(query.question, state)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_on_startup():
    await get_state()  # ensure seeded


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
