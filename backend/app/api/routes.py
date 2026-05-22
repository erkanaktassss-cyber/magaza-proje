from collections import Counter
from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import (
    ProductionLine, Downtime, Scrap, ProductionOrder, User,
    LabApproval, InventoryMove, MaintenanceTicket, UtilityReading
)
from app.schemas.common import *
from app.services.ai_rules import generate_recommendations

router = APIRouter()
SECRET = "mvp-secret"
ALGO = "HS256"
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def require_user(authorization: str | None, db: Session):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Yetkisiz")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
    except Exception:
        raise HTTPException(status_code=401, detail="Geçersiz token")
    user = db.get(User, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı yok")
    return user

@router.post('/auth/login', response_model=LoginOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Kullanıcı adı/şifre hatalı")
    token = jwt.encode({"sub": user.id, "exp": datetime.utcnow() + timedelta(hours=12)}, SECRET, algorithm=ALGO)
    return LoginOut(access_token=token, role=user.role, full_name=user.full_name)

@router.get('/lines', response_model=list[LineOut])
def get_lines(db: Session = Depends(get_db)):
    return db.query(ProductionLine).all()

@router.get('/production-orders')
def list_orders(db: Session = Depends(get_db)):
    return db.query(ProductionOrder).order_by(ProductionOrder.id.desc()).all()

@router.post('/production-orders')
def create_order(payload: ProductionOrderIn, authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_user(authorization, db)
    obj = ProductionOrder(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.post('/downtimes')
def create_downtime(payload: DowntimeIn, db: Session = Depends(get_db)):
    obj = Downtime(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.get('/downtimes')
def list_downtimes(db: Session = Depends(get_db)):
    return db.query(Downtime).order_by(Downtime.id.desc()).limit(20).all()

@router.post('/scrap')
def create_scrap(payload: ScrapIn, db: Session = Depends(get_db)):
    obj = Scrap(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.post('/lab-approvals')
def create_lab_approval(payload: LabApprovalIn, db: Session = Depends(get_db)):
    obj = LabApproval(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.get('/lab-approvals/latest')
def latest_lab_approvals(db: Session = Depends(get_db)):
    return db.query(LabApproval).order_by(LabApproval.id.desc()).limit(10).all()

@router.post('/inventory/moves')
def create_inventory_move(payload: InventoryMoveIn, db: Session = Depends(get_db)):
    obj = InventoryMove(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.get('/inventory/moves')
def list_inventory_moves(db: Session = Depends(get_db)):
    return db.query(InventoryMove).order_by(InventoryMove.id.desc()).limit(20).all()

@router.post('/maintenance/tickets')
def create_maintenance_ticket(payload: MaintenanceTicketIn, db: Session = Depends(get_db)):
    obj = MaintenanceTicket(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.get('/maintenance/tickets')
def list_maintenance_tickets(db: Session = Depends(get_db)):
    return db.query(MaintenanceTicket).order_by(MaintenanceTicket.id.desc()).limit(20).all()

@router.post('/utilities/readings')
def create_utility_reading(payload: UtilityReadingIn, db: Session = Depends(get_db)):
    obj = UtilityReading(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.get('/utilities/summary')
def utility_summary(db: Session = Depends(get_db)):
    rows = db.query(UtilityReading.metric, func.sum(UtilityReading.value)).group_by(UtilityReading.metric).all()
    return [{"metric": r[0], "total": float(r[1])} for r in rows]

@router.get('/dashboard', response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db)):
    production = db.query(func.sum(ProductionLine.instant_count)).scalar() or 0
    scrap = db.query(func.sum(Scrap.quantity)).scalar() or 0
    downtime = db.query(func.sum(Downtime.total_minutes)).scalar() or 0
    reason = db.query(Downtime.reason, func.count()).group_by(Downtime.reason).order_by(func.count().desc()).first()
    return DashboardOut(daily_total_production=production,total_scrap=scrap,total_downtime_minutes=downtime,top_downtime_reason=reason[0] if reason else None)

@router.get('/oee', response_model=OeeOut)
def oee(db: Session = Depends(get_db)):
    total_target = db.query(func.sum(ProductionLine.target_count)).scalar() or 1
    total_actual = db.query(func.sum(ProductionLine.instant_count)).scalar() or 0
    total_scrap = db.query(func.sum(ProductionLine.scrap_count)).scalar() or 0
    total_downtime = db.query(func.sum(Downtime.total_minutes)).scalar() or 0
    availability = max(0.0, 1 - (total_downtime / (24 * 60)))
    performance = min(1.0, total_actual / total_target)
    quality = max(0.0, (total_actual - total_scrap) / max(total_actual,1))
    return OeeOut(availability=availability, performance=performance, quality=quality, oee=availability*performance*quality)

@router.get('/ai')
def ai_recommendations(db: Session = Depends(get_db)):
    reasons = [r[0] for r in db.query(Downtime.reason).all()]
    cnt = Counter(reasons)
    total_actual = db.query(func.sum(ProductionLine.instant_count)).scalar() or 0
    total_scrap = db.query(func.sum(Scrap.quantity)).scalar() or 0
    ratio = (total_scrap / total_actual) if total_actual else 0
    return {"recommendations": generate_recommendations(dict(cnt), ratio)}
