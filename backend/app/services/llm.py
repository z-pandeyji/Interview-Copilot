import os
import json
from smolagents import LiteLLMModel
import re
import httpx
from dotenv import load_dotenv


def _get_config() -> dict:
    """Read env vars fresh on every call — survives hot-reload and .env changes."""
    load_dotenv(override=True)
    return {
        "provider": os.getenv("LLM_PROVIDER", "gemini"),
        "gemini_key": os.getenv("GEMINI_API_KEY", ""),
        "gemini_model": os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
        "ollama_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "ollama_model": os.getenv("OLLAMA_MODEL", "llama3"),
    }

def get_smol_model():
    """Returns a configured smolagents Model instance (via litellm)."""
    cfg = _get_config()
    if cfg["provider"] == "gemini":
        os.environ["GEMINI_API_KEY"] = cfg["gemini_key"]
        return LiteLLMModel(model_id=f"gemini/{cfg['gemini_model']}", temperature=0.4)
    else:
        return LiteLLMModel(model_id=f"ollama/{cfg['ollama_model']}", api_base=cfg["ollama_url"], temperature=0.4)


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown wrappers or extra text."""
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    text = re.sub(r"```\s*$", "", text).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group())
    raise ValueError(f"Could not extract valid JSON from LLM response. Raw: {text[:500]}")


async def call_llm(prompt: str) -> str:
    """Call the configured LLM provider and return raw text response."""
    cfg = _get_config()
    if cfg["provider"] == "ollama":
        return await _call_ollama(prompt, cfg)
    return await _call_gemini(prompt, cfg)


async def call_llm_json(prompt: str) -> dict:
    """Call LLM and return parsed JSON dict."""
    raw = await call_llm(prompt)
    return _extract_json(raw)


async def _call_gemini(prompt: str, cfg: dict) -> str:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{cfg['gemini_model']}:generateContent?key={cfg['gemini_key']}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.4, 
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json"
        },
    }
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def _call_ollama(prompt: str, cfg: dict) -> str:
    url = f"{cfg['ollama_url']}/api/generate"
    payload = {"model": cfg["ollama_model"], "prompt": prompt, "stream": False,
               "options": {"temperature": 0.4}}
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        return response.json()["response"]
