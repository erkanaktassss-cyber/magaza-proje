from fastapi import FastAPI, WebSocket
from app.api.routes import router

app = FastAPI(title="FabrikaOS AI API")
app.include_router(router, prefix="/api")

@app.websocket('/ws/production')
async def ws_production(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"event":"connected","message":"Realtime endpoint hazır"})
    while True:
        data = await ws.receive_text()
        await ws.send_json({"event":"echo","data":data})
