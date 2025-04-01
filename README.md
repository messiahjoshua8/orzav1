# Merge API Integration Project

This project demonstrates integration with the Merge API using React frontend and FastAPI backend.

## Project Structure

```
merge-react-app/
├── frontend/           # React frontend application
└── backend/           # FastAPI backend application
```

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_MERGE_PUBLIC_KEY=your_merge_public_key
   VITE_BACKEND_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with:
   ```
   MERGE_API_KEY=your_merge_api_key
   ```
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

## Features
- Merge Link integration for user authentication
- Secure token exchange
- Data fetching from Merge API
- Error handling and loading states
- Environment variable configuration 