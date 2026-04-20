
from __future__ import annotations

import io
import logging
import struct
import time
from dataclasses import dataclass

import numpy as np

from ..config import settings

logger = logging.getLogger(__name__)


# Kokoro language code mapping
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


