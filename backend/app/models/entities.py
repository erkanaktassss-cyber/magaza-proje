from datetime import datetime, date
from sqlalchemy import String, Integer, DateTime, ForeignKey, Date, Float
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
    instant_count: Mapped[int] = mapped_column(Integer, default=0)
    target_count: Mapped[int] = mapped_column(Integer, default=0)
    scrap_count: Mapped[int] = mapped_column(Integer, default=0)


class ProductionOrder(Base):
    __tablename__ = "production_orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(120))
    lot_number: Mapped[str] = mapped_column(String(60))
    kazan_number: Mapped[str] = mapped_column(String(40))
    target_quantity: Mapped[int] = mapped_column(Integer)
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


class OeeSnapshot(Base):
    __tablename__ = "oee_snapshots"
    id: Mapped[int] = mapped_column(primary_key=True)
    line_id: Mapped[int] = mapped_column(ForeignKey("production_lines.id"))
    availability: Mapped[float] = mapped_column(Float)
    performance: Mapped[float] = mapped_column(Float)
    quality: Mapped[float] = mapped_column(Float)
    oee: Mapped[float] = mapped_column(Float)
    captured_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
