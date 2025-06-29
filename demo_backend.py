#!/usr/bin/env python3
"""Demo script showing the syft-datasets backend structure."""

import sys
import os
from datetime import datetime
import uuid

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def demo_backend_structure():
    """Demonstrate the backend structure and models."""
    print("🔍 Syft-Datasets Backend Demo")
    print("=" * 50)
    
    try:
        # Test config
        print("\n📋 Testing Config Module...")
        from backend.config import get_settings
        settings = get_settings()
        print(f"✅ App version: {settings.app_version}")
        print(f"✅ Debug mode: {settings.debug}")
        print(f"✅ API prefix: {settings.api_prefix}")
        
        # Test models
        print("\n📊 Testing Models Module...")
        from backend.models import Dataset, ListDatasetsResponse
        
        # Create a sample dataset
        sample_dataset = Dataset(
            id=str(uuid.uuid4()),
            name="sample_crop_data",
            email="farmer@example.com",
            syft_url="syft://farmer@example.com/private/datasets/sample_crop_data",
            description="Sample agricultural dataset",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            size="1.2 MB",
            type="csv",
            tags=["agriculture", "crops", "example.com"]
        )
        print(f"✅ Created sample dataset: {sample_dataset.name}")
        print(f"   Email: {sample_dataset.email}")
        print(f"   Syft URL: {sample_dataset.syft_url}")
        print(f"   Tags: {sample_dataset.tags}")
        
        # Create a response
        response = ListDatasetsResponse(
            datasets=[sample_dataset],
            total_count=1,
            unique_emails=["farmer@example.com"],
            unique_names=["sample_crop_data"]
        )
        print(f"✅ Created response with {response.total_count} dataset(s)")
        
        # Test utils (without syft dependencies)
        print("\n🔧 Testing Utils Module...")
        from backend.utils import format_syft_url, get_domain_from_email, get_dataset_tags
        
        test_url = format_syft_url("user@example.com", "test_dataset")
        print(f"✅ Formatted Syft URL: {test_url}")
        
        domain = get_domain_from_email("user@example.com")
        print(f"✅ Extracted domain: {domain}")
        
        tags = get_dataset_tags("user@example.com", "financial_data")
        print(f"✅ Generated tags: {tags}")
        
        print("\n🎉 Backend structure demo completed successfully!")
        print("\n📝 What this demonstrates:")
        print("   • FastAPI backend structure following organic-coop patterns")
        print("   • Pydantic models for type-safe API responses")
        print("   • Configuration management with environment variables")
        print("   • Utility functions for dataset operations")
        print("   • Ready for integration with syft-datasets package")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        print("\n💡 To fix this, install the required dependencies:")
        print("   uv sync")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_api_structure():
    """Show the API structure that would be available."""
    print("\n🌐 API Structure Preview")
    print("=" * 30)
    print("GET  /api/health                    - Health check")
    print("GET  /api/v1/datasets              - List all datasets")
    print("POST /api/v1/datasets/search       - Search datasets")
    print("POST /api/v1/datasets/filter-by-email - Filter by email")
    print("GET  /api/v1/datasets/emails       - Get unique emails")
    print("GET  /api/v1/datasets/names        - Get unique names")
    print("\n📖 Full API docs available at: http://localhost:8001/docs")

def main():
    """Run the demo."""
    success = demo_backend_structure()
    
    if success:
        show_api_structure()
        print("\n" + "=" * 50)
        print("✅ Demo completed! Backend is ready for development.")
        print("\n🚀 To start the full backend (requires syft-datasets):")
        print("   ./run.sh")
        print("\n🔧 To install dependencies:")
        print("   uv sync")
    else:
        print("\n" + "=" * 50)
        print("❌ Demo failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 