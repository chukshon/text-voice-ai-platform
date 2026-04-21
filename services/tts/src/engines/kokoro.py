
from __future__ import annotations

import io
import logging
import struct
import time
from dataclasses import dataclass

import numpy as np

from ..config import settings

logger = logging.getLogger(__name__)


LANG_CODES: dict[str, str] = {
    "en": "a",  # American English
    "en-us": "a",  # American English
    "en-gb": "b",  # British English
    "es": "e",  # Spanish
    "fr": "f",  # French
    "hi": "h",  # Hindi
    "it": "i",  # Italian
    "ja": "j",  # Japanese
    "ko": "k",  # Korean
    "pt": "p",  # Portuguese
    "zh": "z",  # Chinese
}



# Voices grouped by language and gender
VOICES: dict[str, dict] = {
    # American English - Female
    "af_alloy": {
        "name": "Alloy",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_aoede": {
        "name": "Aoede",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_bella": {
        "name": "Bella",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_heart": {
        "name": "Heart",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_jessica": {
        "name": "Jessica",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_nicole": {
        "name": "Nicole",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_nova": {
        "name": "Nova",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_river": {
        "name": "River",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_sarah": {
        "name": "Sarah",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    "af_sky": {
        "name": "Sky",
        "gender": "female",
        "language": "en",
        "accent": "american",
    },
    # American English - Male
    "am_adam": {
        "name": "Adam",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_echo": {
        "name": "Echo",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_eric": {
        "name": "Eric",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_fable": {
        "name": "Fable",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_liam": {
        "name": "Liam",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_michael": {
        "name": "Michael",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    "am_onyx": {
        "name": "Onyx",
        "gender": "male",
        "language": "en",
        "accent": "american",
    },
    # British English - Female
    "bf_alice": {
        "name": "Alice",
        "gender": "female",
        "language": "en",
        "accent": "british",
    },
    "bf_emma": {
        "name": "Emma",
        "gender": "female",
        "language": "en",
        "accent": "british",
    },
    "bf_isabella": {
        "name": "Isabella",
        "gender": "female",
        "language": "en",
        "accent": "british",
    },
    "bf_lily": {
        "name": "Lily",
        "gender": "female",
        "language": "en",
        "accent": "british",
    },
    # British English - Male
    "bm_daniel": {
        "name": "Daniel",
        "gender": "male",
        "language": "en",
        "accent": "british",
    },
    "bm_george": {
        "name": "George",
        "gender": "male",
        "language": "en",
        "accent": "british",
    },
    "bm_lewis": {
        "name": "Lewis",
        "gender": "male",
        "language": "en",
        "accent": "british",
    },
    "bm_oliver": {
        "name": "Oliver",
        "gender": "male",
        "language": "en",
        "accent": "british",
    },
}