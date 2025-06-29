# Standard library imports
from datetime import datetime
from typing import List, Optional

# Third-party imports
from pydantic import BaseModel


class Dataset(BaseModel):
    """Dataset model for API responses"""
    
    id: str
    name: str
    email: str
    syft_url: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    size: Optional[str] = None
    type: Optional[str] = None
    tags: List[str] = []


class ListDatasetsResponse(BaseModel):
    """Response model for listing datasets"""
    
    datasets: List[Dataset]
    total_count: int
    unique_emails: List[str]
    unique_names: List[str]


class SearchDatasetsRequest(BaseModel):
    """Request model for searching datasets"""
    
    keyword: str


class FilterByEmailRequest(BaseModel):
    """Request model for filtering datasets by email"""
    
    email_pattern: str


class HealthResponse(BaseModel):
    """Health check response"""
    
    status: str
    message: str
    timestamp: datetime 