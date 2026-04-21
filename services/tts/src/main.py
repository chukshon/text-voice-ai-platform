"""Text-to-Speech Service — FastAPI application.

Wraps the Kokoro TTS engine behind a simple HTTP API.
The worker service calls POST /v1/synthesize to generate audio.
"""

import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from .config import settings
from .engines import kokoro

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)


app = FastAPI(
    title="text-voice-ai-platform",
    version="0.1.0",
    description="Text-to-Speech synthesis powered by Kokoro",
)
