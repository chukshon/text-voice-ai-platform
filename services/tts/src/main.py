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


class SynthesizeRequest(BaseModel):
    text: str = Field(
        ..., min_length=1, max_length=10000, description="Text to synthesize"
    )
    voice_id: str = Field(default="af_heart", description="Kokoro voice ID")
    language: str = Field(
        default="en", description="Language code (en, en-gb, fr, etc.)"
    )
    output_format: str = Field(
        default="wav", pattern="^(wav|mp3)$", description="Audio format"
    )
    speed: float = Field(
        default=1.0, ge=0.5, le=2.0, description="Speech speed multiplier"
    )
