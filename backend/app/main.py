from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import circuits, telemetry, strategy, drivers

app = FastAPI(
    title="ApexIntel API - Motorsport Energy & Overtake Intelligence Platform",
    description="Enterprise API providing Grand Prix telemetry mining, battery SoC deployment optimization, and deterministic overtaking corridor calculation.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(circuits.router)
app.include_router(telemetry.router)
app.include_router(strategy.router)
app.include_router(drivers.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "ApexIntel AI Motorsport Intelligence",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
