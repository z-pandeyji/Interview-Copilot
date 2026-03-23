from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router
from app.routes.evaluate import router as evaluate_router
from app.routes.memory import router as memory_router

app = FastAPI(title="AI Interview Copilot")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api", tags=["Analysis"])
app.include_router(evaluate_router, prefix="/api", tags=["Evaluation"])
app.include_router(memory_router, prefix="/api/memory", tags=["Memory"])


@app.get("/")
async def root():
    return {"status": "AI Interview Copilot API is running", "version": "0.1.0"}
