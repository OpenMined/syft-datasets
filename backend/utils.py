# Standard library imports
from typing import Optional

# Third-party imports
try:
    from loguru import logger
    from syft_core import Client
    import syft_datasets as syd
    SYFT_AVAILABLE = True
except ImportError:
    SYFT_AVAILABLE = False
    logger = None


def get_datasets_collection(client=None):
    """Get the datasets collection from syft-datasets"""
    if not SYFT_AVAILABLE:
        # Return a mock collection for demo purposes
        class MockDataset:
            def __init__(self, email, name):
                self.email = email
                self.name = name
                self.syft_url = f"syft://{email}/private/datasets/{name}"
        
        class MockCollection:
            def __init__(self):
                self._datasets = [
                    MockDataset("demo@example.com", "sample_dataset"),
                    MockDataset("user@test.com", "test_data"),
                ]
            
            def list_unique_emails(self):
                return list(set(ds.email for ds in self._datasets))
            
            def list_unique_names(self):
                return list(set(ds.name for ds in self._datasets))
        
        return MockCollection()
    
    try:
        # Use syft-datasets to get the collection
        return syd.datasets
    except Exception as e:
        if logger:
            logger.error(f"Failed to get datasets collection: {e}")
        # Return empty collection if there's an error
        return syd.DatasetCollection()


def format_syft_url(email: str, dataset_name: str) -> str:
    """Format a SyftBox URL for a dataset"""
    return f"syft://{email}/private/datasets/{dataset_name}"


def get_domain_from_email(email: str) -> str:
    """Extract domain from email address"""
    if "@" in email:
        return email.split("@")[1]
    return email


def get_dataset_tags(email: str, dataset_name: str) -> list[str]:
    """Generate tags for a dataset based on email and name"""
    tags = []
    
    # Add domain as tag
    domain = get_domain_from_email(email)
    if domain:
        tags.append(domain)
    
    # Add common keywords as tags
    name_lower = dataset_name.lower()
    if any(keyword in name_lower for keyword in ["crop", "agriculture", "farming"]):
        tags.append("agriculture")
    if any(keyword in name_lower for keyword in ["financial", "finance", "money"]):
        tags.append("finance")
    if any(keyword in name_lower for keyword in ["health", "medical", "patient"]):
        tags.append("healthcare")
    if any(keyword in name_lower for keyword in ["education", "student", "school"]):
        tags.append("education")
    
    return tags 