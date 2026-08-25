from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.patients_router import router as patients_router
from src.config.database import init_db

app = FastAPI(
    title="Clinical Electronic Health Record (EHR) API",
    description="Enterprise patient clinical record management and biometric telemetry telemetry stream.",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(patients_router, prefix="/api/v1/patients", tags=["Patients"])

@app.get("/health")
async def health_check():
    return {"status": "HEALTHY", "service": "clinical-ehr-api", "version": "2.1.0"}
