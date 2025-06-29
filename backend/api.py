# Standard library imports
from datetime import datetime
from typing import List
import uuid

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from syft_core import Client

# Local imports
from .models import (
    Dataset,
    ListDatasetsResponse,
    SearchDatasetsRequest,
    FilterByEmailRequest,
    HealthResponse,
)
from .utils import get_datasets_collection


# Dependency for getting client
async def get_client() -> Client:
    try:
        return Client.load()
    except Exception as e:
        logger.error(f"Failed to load client: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize client")


api_router = APIRouter(prefix="/api", dependencies=[Depends(get_client)])
v1_router = APIRouter(prefix="/v1", dependencies=[Depends(get_client)])

# --------------- Dataset Endpoints ---------------


@v1_router.get(
    "/datasets",
    tags=["datasets"],
    summary="List all datasets",
    description="Retrieve a list of all available datasets in the SyftBox ecosystem",
)
async def list_datasets(
    client: Client = Depends(get_client),
) -> ListDatasetsResponse:
    try:
        datasets_collection = get_datasets_collection(client)
        
        # Convert to API models
        api_datasets = []
        for dataset in datasets_collection._datasets:
            api_dataset = Dataset(
                id=str(uuid.uuid4()),  # Generate unique ID for UI
                name=dataset.name,
                email=dataset.email,
                syft_url=dataset.syft_url,
                description=f"Dataset from {dataset.email}",
                created_at=datetime.now(),  # TODO: Get actual creation time if available
                updated_at=datetime.now(),  # TODO: Get actual update time if available
                size="Unknown",  # TODO: Get actual size if available
                type="dataset",  # TODO: Get actual type if available
                tags=[dataset.email.split("@")[1] if "@" in dataset.email else dataset.email]
            )
            api_datasets.append(api_dataset)
        
        return ListDatasetsResponse(
            datasets=api_datasets,
            total_count=len(api_datasets),
            unique_emails=datasets_collection.list_unique_emails(),
            unique_names=datasets_collection.list_unique_names(),
        )
    except Exception as e:
        logger.error(f"Error listing datasets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@v1_router.post(
    "/datasets/search",
    tags=["datasets"],
    summary="Search datasets",
    description="Search for datasets containing a keyword in name or email",
)
async def search_datasets(
    request: SearchDatasetsRequest,
    client: Client = Depends(get_client),
) -> ListDatasetsResponse:
    try:
        datasets_collection = get_datasets_collection(client)
        search_results = datasets_collection.search(request.keyword)
        
        # Convert to API models
        api_datasets = []
        for dataset in search_results._datasets:
            api_dataset = Dataset(
                id=str(uuid.uuid4()),
                name=dataset.name,
                email=dataset.email,
                syft_url=dataset.syft_url,
                description=f"Dataset from {dataset.email}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                size="Unknown",
                type="dataset",
                tags=[dataset.email.split("@")[1] if "@" in dataset.email else dataset.email]
            )
            api_datasets.append(api_dataset)
        
        return ListDatasetsResponse(
            datasets=api_datasets,
            total_count=len(api_datasets),
            unique_emails=search_results.list_unique_emails(),
            unique_names=search_results.list_unique_names(),
        )
    except Exception as e:
        logger.error(f"Error searching datasets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@v1_router.post(
    "/datasets/filter-by-email",
    tags=["datasets"],
    summary="Filter datasets by email",
    description="Filter datasets by email pattern",
)
async def filter_datasets_by_email(
    request: FilterByEmailRequest,
    client: Client = Depends(get_client),
) -> ListDatasetsResponse:
    try:
        datasets_collection = get_datasets_collection(client)
        filtered_results = datasets_collection.filter_by_email(request.email_pattern)
        
        # Convert to API models
        api_datasets = []
        for dataset in filtered_results._datasets:
            api_dataset = Dataset(
                id=str(uuid.uuid4()),
                name=dataset.name,
                email=dataset.email,
                syft_url=dataset.syft_url,
                description=f"Dataset from {dataset.email}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                size="Unknown",
                type="dataset",
                tags=[dataset.email.split("@")[1] if "@" in dataset.email else dataset.email]
            )
            api_datasets.append(api_dataset)
        
        return ListDatasetsResponse(
            datasets=api_datasets,
            total_count=len(api_datasets),
            unique_emails=filtered_results.list_unique_emails(),
            unique_names=filtered_results.list_unique_names(),
        )
    except Exception as e:
        logger.error(f"Error filtering datasets: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@v1_router.get(
    "/datasets/emails",
    tags=["datasets"],
    summary="List unique emails",
    description="Get list of unique email addresses from all datasets",
)
async def list_unique_emails(
    client: Client = Depends(get_client),
) -> List[str]:
    try:
        datasets_collection = get_datasets_collection(client)
        return datasets_collection.list_unique_emails()
    except Exception as e:
        logger.error(f"Error listing unique emails: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@v1_router.get(
    "/datasets/names",
    tags=["datasets"],
    summary="List unique names",
    description="Get list of unique dataset names",
)
async def list_unique_names(
    client: Client = Depends(get_client),
) -> List[str]:
    try:
        datasets_collection = get_datasets_collection(client)
        return datasets_collection.list_unique_names()
    except Exception as e:
        logger.error(f"Error listing unique names: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --------------- Health Check ---------------


@api_router.get(
    "/health",
    summary="Health check endpoint",
    description="Check if the API is running properly",
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        message="Syft-Datasets API is running",
        timestamp=datetime.now(),
    )


# Include v1 router
api_router.include_router(v1_router) 