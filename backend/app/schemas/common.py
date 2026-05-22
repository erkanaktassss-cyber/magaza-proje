from datetime import datetime, date
from pydantic import BaseModel

class LoginIn(BaseModel):
    email: str
    password: str

class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str

class LineOut(BaseModel):
    id: int
    line_name: str
    machine_name: str
    status: str
    current_product: str
    shift: str
    instant_count: int
    target_count: int
    scrap_count: int

class DashboardOut(BaseModel):
    daily_total_production: int
    total_scrap: int
    total_downtime_minutes: int
    top_downtime_reason: str | None

class OeeOut(BaseModel):
    availability: float
    performance: float
    quality: float
    oee: float

class ProductionOrderIn(BaseModel):
    product_name: str
    product_code: str
    lot_number: str
    kazan_number: str
    line_name: str
    target_quantity: int
    unit: str
    packaging_type: str
    start_date: date
    shift: str
    operator_id: int

class DowntimeIn(BaseModel):
    line_id: int
    start_time: datetime
    end_time: datetime
    reason: str
    description: str
    department: str
    total_minutes: int

class ScrapIn(BaseModel):
    product_name: str
    line_id: int
    reason: str
    quantity: int
    description: str

class LabApprovalIn(BaseModel):
    production_order_id: int
    recipe_version: str
    additive_decision: str
    quality_result: str
    approved: bool

class InventoryMoveIn(BaseModel):
    material_type: str
    material_code: str
    lot_number: str
    pallet_no: str
    shelf_code: str
    quantity: float
    unit: str
    movement_type: str

class MaintenanceTicketIn(BaseModel):
    line_id: int
    fault_code: str
    description: str
    intervention_minutes: int
    responsible_team: str

class UtilityReadingIn(BaseModel):
    metric: str
    value: float
    unit: str
    recorded_at: datetime
