from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID

class ClinicalRecordCreate(BaseModel):
    diagnosis_code: str = Field(..., example="I10")
    systolic_bp: Optional[float] = Field(None, example=120.0)
    diastolic_bp: Optional[float] = Field(None, example=80.0)
    heart_rate: Optional[float] = Field(None, example=72.0)
    clinical_notes: Optional[str] = Field(None, example="Routine physical examination normal.")
    attending_physician: str = Field(..., example="Dr. Gregory House, MD")

class ClinicalRecordResponse(ClinicalRecordCreate):
    id: UUID
    patient_id: UUID
    recorded_at: datetime

    class Config:
        from_attributes = True

class PatientCreate(BaseModel):
    medical_record_number: str = Field(..., example="MRN-88231")
    first_name: str = Field(..., example="Sarah")
    last_name: str = Field(..., example="Connor")
    date_of_birth: date = Field(..., example="1985-06-15")
    blood_group: Optional[str] = Field(None, example="O+")
    contact_phone: Optional[str] = Field(None, example="+1-555-0199")

class PatientResponse(PatientCreate):
    id: UUID
    created_at: datetime
    records: List[ClinicalRecordResponse] = []

    class Config:
        from_attributes = True
