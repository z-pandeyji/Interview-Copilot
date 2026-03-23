from fastapi import APIRouter, HTTPException, UploadFile, File
import io

from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.services.agents.orchestrator import run_pipeline

router = APIRouter()


def _extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from a PDF using pdfplumber."""
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        if not text.strip():
            raise ValueError("PDF appears to be empty or image-based (no extractable text).")
        return text.strip()
    except ImportError:
        raise HTTPException(status_code=500, detail="PDF extraction library not installed.")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not extract text from PDF: {str(e)}")


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Phase 5: Run the 4-agent pipeline.
    Agent 1 (Resume Reviewer) + Agent 2 (JD Analyzer) run in parallel.
    Agent 3 (Match Evaluator) uses their outputs.
    Agent 4 (Interview Generator) uses all three outputs.
    """
    try:
        result = await run_pipeline(
            resume=request.resume,
            job_description=request.job_description,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Agent output parsing failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """Extract text from an uploaded PDF file."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
    text = _extract_pdf_text(content)
    return {"text": text, "filename": file.filename, "chars": len(text)}
