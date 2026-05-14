from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import ProductionLine, Downtime, Scrap, ProductionOrder
from app.schemas.common import LineOut, DashboardOut, OeeOut, ProductionOrderIn, DowntimeIn, ScrapIn
from app.services.ai_rules import generate_recommendations

router = APIRouter()

@router.get('/lines', response_model=list[LineOut])
def get_lines(db: Session = Depends(get_db)):
    return db.query(ProductionLine).all()

@router.post('/production-orders')
def create_order(payload: ProductionOrderIn, db: Session = Depends(get_db)):
    obj = ProductionOrder(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id}

@router.post('/downtimes')
def create_downtime(payload: DowntimeIn, db: Session = Depends(get_db)):
    obj = Downtime(**payload.model_dump())
    db.add(obj); db.commit()
    return {"ok": True}

@router.post('/scrap')
def create_scrap(payload: ScrapIn, db: Session = Depends(get_db)):
    obj = Scrap(**payload.model_dump())
    db.add(obj); db.commit()
    return {"ok": True}

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


@router.get('/ai-recommendations')
def ai_recommendations_legacy(db: Session = Depends(get_db)):
    return ai_recommendations(db)
