from datetime import datetime, date
from sqlalchemy import String, Integer, DateTime, ForeignKey, Date, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50))


class ProductionLine(Base):
    __tablename__ = "production_lines"
    id: Mapped[int] = mapped_column(primary_key=True)
    line_name: Mapped[str] = mapped_column(String(100))
    machine_name: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30))
    current_product: Mapped[str] = mapped_column(String(100), default="-")
    shift: Mapped[str] = mapped_column(String(30), default="Gündüz")
    instant_count: Mapped[int] = mapped_column(Integer, default=0)
    target_count: Mapped[int] = mapped_column(Integer, default=0)
    scrap_count: Mapped[int] = mapped_column(Integer, default=0)


class ProductionOrder(Base):
    __tablename__ = "production_orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(120))
    product_code: Mapped[str] = mapped_column(String(60))
    lot_number: Mapped[str] = mapped_column(String(60))
    kazan_number: Mapped[str] = mapped_column(String(40))
    line_name: Mapped[str] = mapped_column(String(40))
    target_quantity: Mapped[int] = mapped_column(Integer)
    unit: Mapped[str] = mapped_column(String(10), default="kg")
    packaging_type: Mapped[str] = mapped_column(String(50), default="Koli")
    start_date: Mapped[date] = mapped_column(Date)
    shift: Mapped[str] = mapped_column(String(30))
    operator_id: Mapped[int] = mapped_column(ForeignKey("users.id"))


class Downtime(Base):
    __tablename__ = "downtimes"
    id: Mapped[int] = mapped_column(primary_key=True)
    line_id: Mapped[int] = mapped_column(ForeignKey("production_lines.id"))
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)
    reason: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(80))
    total_minutes: Mapped[int] = mapped_column(Integer)


class Scrap(Base):
    __tablename__ = "scrap_records"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(120))
    line_id: Mapped[int] = mapped_column(ForeignKey("production_lines.id"))
    reason: Mapped[str] = mapped_column(String(120))
    quantity: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(String(255))


class LabApproval(Base):
    __tablename__ = "lab_approvals"
    id: Mapped[int] = mapped_column(primary_key=True)
    production_order_id: Mapped[int] = mapped_column(ForeignKey("production_orders.id"))
    recipe_version: Mapped[str] = mapped_column(String(80))
    additive_decision: Mapped[str] = mapped_column(String(120))
    quality_result: Mapped[str] = mapped_column(String(120))
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    approved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class InventoryMove(Base):
    __tablename__ = "inventory_moves"
    id: Mapped[int] = mapped_column(primary_key=True)
    material_type: Mapped[str] = mapped_column(String(80))
    material_code: Mapped[str] = mapped_column(String(80))
    lot_number: Mapped[str] = mapped_column(String(80))
    pallet_no: Mapped[str] = mapped_column(String(80))
    shelf_code: Mapped[str] = mapped_column(String(80))
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(20))
    movement_type: Mapped[str] = mapped_column(String(20))
    moved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MaintenanceTicket(Base):
    __tablename__ = "maintenance_tickets"
    id: Mapped[int] = mapped_column(primary_key=True)
    line_id: Mapped[int] = mapped_column(ForeignKey("production_lines.id"))
    fault_code: Mapped[str] = mapped_column(String(60))
    description: Mapped[str] = mapped_column(String(255))
    intervention_minutes: Mapped[int] = mapped_column(Integer)
    responsible_team: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UtilityReading(Base):
    __tablename__ = "utility_readings"
    id: Mapped[int] = mapped_column(primary_key=True)
    metric: Mapped[str] = mapped_column(String(50))
    value: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(20))
    recorded_at: Mapped[datetime] = mapped_column(DateTime)


class OeeSnapshot(Base):
    __tablename__ = "oee_snapshots"
    id: Mapped[int] = mapped_column(primary_key=True)
    line_id: Mapped[int] = mapped_column(ForeignKey("production_lines.id"))
    availability: Mapped[float] = mapped_column(Float)
    performance: Mapped[float] = mapped_column(Float)
    quality: Mapped[float] = mapped_column(Float)
    oee: Mapped[float] = mapped_column(Float)
    captured_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
