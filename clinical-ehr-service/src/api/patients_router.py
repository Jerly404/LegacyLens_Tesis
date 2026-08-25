from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.database import get_db
from src.repositories.patient_repository import PatientRepository
from src.services.patient_service import PatientService
from src.schemas.patient_dto import PatientCreate, PatientResponse, ClinicalRecordCreate, ClinicalRecordResponse

router = APIRouter()

def get_service(session: AsyncSession = Depends(get_db)) -> PatientService:
    repo = PatientRepository(session)
    return PatientService(repo)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def register_patient(dto: PatientCreate, service: PatientService = Depends(get_service)):
    try:
        return await service.register_new_patient(dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: UUID, service: PatientService = Depends(get_service)):
    patient = await service.fetch_patient_summary(patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient record not found")
    return patient

@router.get("/", response_model=List[PatientResponse])
async def list_patients(limit: int = 50, service: PatientService = Depends(get_service)):
    return await service.retrieve_all_patients(limit=limit)

@router.post("/{patient_id}/records", response_model=ClinicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def add_clinical_observation(
    patient_id: UUID, 
    dto: ClinicalRecordCreate, 
    service: PatientService = Depends(get_service)
):
    try:
        return await service.append_clinical_observation(patient_id, dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
