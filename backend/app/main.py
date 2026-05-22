from fastapi import FastAPI, WebSocket
from app.api.routes import router
from app.db.base import Base
from app.db.session import engine
from app.models import entities  # noqa: F401

app = FastAPI(title="Fabrika Dijital Üretim API")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api")

@app.get('/health')
def health():
    return {"ok": True}

@app.websocket('/ws/production')
async def ws_production(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"event":"connected","message":"Realtime endpoint hazır"})
    while True:
        data = await ws.receive_text()
        await ws.send_json({"event":"echo","data":data})
