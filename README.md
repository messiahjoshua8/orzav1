# Orza v1

A full-stack application that integrates Merge ATS with Supabase for candidate management.

## Features

- Merge ATS API Integration
- Supabase Database Integration
- Candidate Data Synchronization
- Modern React Frontend
- FastAPI Backend

## Project Structure

```
.
├── backend/           # FastAPI backend
│   ├── app.py        # Main FastAPI application
│   ├── merge_routes.py # Merge API routes
│   ├── merge_supabase.py # Supabase integration
│   └── requirements.txt
└── frontend/         # React frontend
    ├── src/
    └── package.json
```

## Setup

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Add your Merge API and Supabase credentials
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 (Backend)
   cd backend
   uvicorn app:app --reload --host 0.0.0.0 --port 8085

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with:

```
MERGE_API_KEY=your_merge_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## API Endpoints

- `GET /merge/candidates`: Fetch candidates from Merge ATS
- `POST /merge-supabase/sync-candidates`: Sync candidates to Supabase
- `GET /merge-supabase/get-transformed-candidates`: Get transformed candidate data

## Database Schema

The application uses Supabase with the following main table:

```sql
CREATE TABLE candidates (
  merge_id UUID PRIMARY KEY,
  remote_id TEXT,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  modified_at TIMESTAMP WITH TIME ZONE,
  remote_created_at TIMESTAMP WITH TIME ZONE,
  remote_updated_at TIMESTAMP WITH TIME ZONE,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  is_private BOOLEAN,
  can_email BOOLEAN,
  remote_was_deleted BOOLEAN,
  applications_json JSONB,
  attachments_json JSONB,
  locations_json JSONB,
  phone_numbers_json JSONB,
  email_addresses_json JSONB,
  urls_json JSONB,
  tags_json JSONB,
  field_mappings_json JSONB,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
