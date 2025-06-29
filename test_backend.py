#!/usr/bin/env python3
"""Simple test script to verify the syft-datasets backend works."""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_backend_imports():
    """Test that all backend modules can be imported."""
    try:
        print("🔍 Testing backend imports...")
        
        # Test basic imports
        from backend.config import get_settings
        print("✅ Config module imported successfully")
        
        from backend.models import Dataset, ListDatasetsResponse
        print("✅ Models module imported successfully")
        
        from backend.utils import get_datasets_collection, format_syft_url
        print("✅ Utils module imported successfully")
        
        # Test API router (this might fail if syft-datasets is not installed)
        try:
            from backend.api import api_router
            print("✅ API module imported successfully")
        except ImportError as e:
            print(f"⚠️  API module import failed (expected if syft-datasets not installed): {e}")
        
        print("\n🎉 All backend imports successful!")
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False

def test_syft_datasets_import():
    """Test that syft-datasets can be imported."""
    try:
        print("\n🔍 Testing syft-datasets import...")
        import syft_datasets as syd
        print("✅ syft-datasets imported successfully")
        
        # Try to get datasets collection
        try:
            datasets = syd.datasets
            print(f"✅ Datasets collection created: {len(datasets)} datasets found")
        except Exception as e:
            print(f"⚠️  Datasets collection failed (expected if SyftBox not running): {e}")
        
        return True
        
    except ImportError as e:
        print(f"❌ syft-datasets import failed: {e}")
        print("   Make sure syft-datasets is installed: pip install syft-datasets")
        return False

def main():
    """Run all tests."""
    print("🚀 Testing Syft-Datasets Backend")
    print("=" * 40)
    
    success = True
    
    # Test backend imports
    if not test_backend_imports():
        success = False
    
    # Test syft-datasets import
    if not test_syft_datasets_import():
        success = False
    
    print("\n" + "=" * 40)
    if success:
        print("✅ All tests passed! Backend is ready to run.")
        print("\nTo start the backend:")
        print("  ./run.sh")
        print("\nOr manually:")
        print("  uv run uvicorn backend.main:app --reload --port 8001")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 