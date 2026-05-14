from datetime import datetime, date
from pydantic import BaseModel


class LineOut(BaseModel):
    id: int
    line_name: str
    machine_name: str
    status: str
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
    lot_number: str
    kazan_number: str
    target_quantity: int
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
