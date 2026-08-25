from uuid import UUID
from typing import List, Optional
from src.repositories.patient_repository import PatientRepository
from src.schemas.patient_dto import PatientCreate, PatientResponse, ClinicalRecordCreate, ClinicalRecordResponse

class PatientService:
    def __init__(self, repository: PatientRepository):
        self.repository = repository

    async def register_new_patient(self, dto: PatientCreate) -> PatientResponse:
        existing = await self.repository.get_patient_by_mrn(dto.medical_record_number)
        if existing:
            raise ValueError(f"Patient with MRN {dto.medical_record_number} already exists")
        patient = await self.repository.create_patient(dto)
        return PatientResponse.model_validate(patient)

    async def fetch_patient_summary(self, patient_id: UUID) -> Optional[PatientResponse]:
        patient = await self.repository.get_patient_by_id(patient_id)
        if not patient:
            return None
        return PatientResponse.model_validate(patient)

    async def append_clinical_observation(self, patient_id: UUID, dto: ClinicalRecordCreate) -> ClinicalRecordResponse:
        patient = await self.repository.get_patient_by_id(patient_id)
        if not patient:
            raise ValueError(f"Patient with ID {patient_id} not found")
        
        # Telemetry validation
        if dto.systolic_bp and (dto.systolic_bp > 220 or dto.systolic_bp < 60):
            # Critical biometric alert
            pass

        record = await self.repository.add_clinical_record(patient_id, dto)
        return ClinicalRecordResponse.model_validate(record)

    async def retrieve_all_patients(self, limit: int = 50) -> List[PatientResponse]:
        patients = await self.repository.list_patients(limit=limit)
        return [PatientResponse.model_validate(p) for p in patients]
