from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.models.patient import Patient
from src.models.clinical_record import ClinicalRecord
from src.schemas.patient_dto import PatientCreate, ClinicalRecordCreate

class PatientRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_patient(self, dto: PatientCreate) -> Patient:
        patient = Patient(**dto.model_dump())
        self.session.add(patient)
        await self.session.commit()
        await self.session.refresh(patient)
        return patient

    async def get_patient_by_id(self, patient_id: UUID) -> Optional[Patient]:
        stmt = select(Patient).options(selectinload(Patient.records)).where(Patient.id == patient_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_patient_by_mrn(self, mrn: str) -> Optional[Patient]:
        stmt = select(Patient).options(selectinload(Patient.records)).where(Patient.medical_record_number == mrn)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_patients(self, limit: int = 50, offset: int = 0) -> List[Patient]:
        stmt = select(Patient).options(selectinload(Patient.records)).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add_clinical_record(self, patient_id: UUID, dto: ClinicalRecordCreate) -> ClinicalRecord:
        record = ClinicalRecord(patient_id=patient_id, **dto.model_dump())
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record
