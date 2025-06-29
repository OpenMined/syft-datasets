# Standard library imports
from typing import Optional

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from loguru import logger

# Local imports
from .api import api_router
from .config import get_settings
from .utils import get_datasets_collection


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None


# Initialize syft-datasets on module import to trigger logging
try:
    from syft_core import Client
    client = Client.load()
    logger.info(f"✅ SyftBox filesystem accessible — logged in as: {client.email}")
    logger.info(f"✅ SyftBox app running at {client.config.client_url}")
    
    # Trigger syft-datasets initialization to show status messages
    datasets_collection = get_datasets_collection(client)
    logger.info(f"📊 Loaded {len(datasets_collection._datasets)} datasets from SyftBox")
    
except Exception as e:
    logger.error(f"❌ Failed to initialize SyftBox connection: {e}")
    logger.error("    Make sure SyftBox is installed and you're logged in")


app = FastAPI(
    title="Syft-Datasets UI",
    description="API for browsing and managing datasets in the SyftBox ecosystem",
    version=get_settings().app_version,
    debug=get_settings().debug,
    responses={
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
        400: {"model": ErrorResponse, "description": "Bad Request"},
    },
)
if get_settings().debug:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:*",
            "http://127.0.0.1:*"
        ],
        allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)
app.mount("/", StaticFiles(directory="frontend/out", html=True, check_dir=False)) 