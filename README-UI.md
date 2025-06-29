# 🔍 Syft-Datasets UI

A beautiful web interface for browsing and discovering datasets in the SyftBox ecosystem. Built with FastAPI and Next.js, following the same patterns as organic-coop.

## 🚀 Features

- **Dataset Discovery**: Browse all available datasets across your connected datasites
- **Smart Search**: Search datasets by name or email
- **Email Filtering**: Filter datasets by specific email addresses
- **One-Click Actions**: Copy SyftBox URLs and Python code snippets
- **Modern UI**: Beautiful, responsive interface with dark/light mode support
- **Real-time Updates**: Live search and filtering without page reloads

## 🛠️ Development

### Prerequisites

- **SyftBox** installed and running
- **Python 3.9+** with uv package manager
- **Node.js 18+** with bun package manager
- **Just** command runner (optional, for convenience)

### Quick Start

1. **Install dependencies**:
   ```bash
   # Backend dependencies
   uv sync
   
   # Frontend dependencies
   bun install --cwd frontend
   ```

2. **Start development server**:
   ```bash
   just dev
   ```
   
   This will start both the FastAPI backend (port 8001) and Next.js frontend (port 3000).

3. **Open your browser**:
   Navigate to `http://localhost:3000` to see the UI.

### Alternative Commands

If you don't have `just` installed:

```bash
# Start backend only
uv run uvicorn backend.main:app --reload --port 8001

# Start frontend only (in another terminal)
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8001 bun run dev
```

## 🏗️ Architecture

### Backend (FastAPI)

- **`backend/main.py`**: FastAPI application setup with CORS and static file serving
- **`backend/api.py`**: API endpoints for dataset operations
- **`backend/models.py`**: Pydantic models for API requests/responses
- **`backend/utils.py`**: Utility functions for dataset operations
- **`backend/config.py`**: Application configuration

### Frontend (Next.js)

- **`frontend/app/`**: Next.js app router pages
- **`frontend/components/`**: Reusable React components
- **`frontend/lib/`**: API client and utility functions
- **`frontend/components/ui/`**: Shadcn/ui components

## 📡 API Endpoints

### Datasets

- `GET /api/v1/datasets` - List all datasets
- `POST /api/v1/datasets/search` - Search datasets by keyword
- `POST /api/v1/datasets/filter-by-email` - Filter datasets by email
- `GET /api/v1/datasets/emails` - Get unique email addresses
- `GET /api/v1/datasets/names` - Get unique dataset names

### Health

- `GET /api/health` - Health check endpoint

## 🎨 UI Components

### Main Features

- **Dataset Cards**: Display dataset information in a clean card layout
- **Search Bar**: Real-time search with keyboard shortcuts
- **Email Filter**: Dropdown to filter by specific email addresses
- **Copy Actions**: One-click copying of SyftBox URLs and Python code
- **Responsive Design**: Works on desktop, tablet, and mobile

### Key Components

- `DatasetsView`: Main component for displaying and interacting with datasets
- `ThemeProvider`: Dark/light mode support
- UI components from shadcn/ui (Button, Card, Input, etc.)

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Frontend API base URL (default: `http://localhost:8001`)
- `SYFTBOX_CLIENT_CONFIG_PATH`: Custom SyftBox client config path

### Custom SyftBox Config

To use a custom SyftBox configuration:

```bash
just dev config_path="/path/to/your/syftbox/config"
```

## 🚀 Production Deployment

1. **Build the frontend**:
   ```bash
   just build-frontend
   ```

2. **Start the production server**:
   ```bash
   just prod
   ```

The FastAPI server will serve the static frontend build and handle API requests.

## 🔍 Usage Examples

### Basic Dataset Browsing

1. Open the UI in your browser
2. Browse all available datasets in the grid view
3. Use the search bar to find specific datasets
4. Filter by email using the dropdown

### Copying Dataset Information

1. Click "Copy URL" to copy the SyftBox URL to clipboard
2. Click "Copy Code" to copy Python code for using the dataset

### Programmatic Access

The UI provides a RESTful API that you can use programmatically:

```python
import requests

# Get all datasets
response = requests.get("http://localhost:8001/api/v1/datasets")
datasets = response.json()

# Search for datasets
response = requests.post("http://localhost:8001/api/v1/datasets/search", 
                        json={"keyword": "crop"})
results = response.json()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the UI locally
5. Submit a pull request

## 📄 License

Apache 2.0 License - see [LICENSE](LICENSE) file.

---

**Discover your datasets with style!** 🎨 