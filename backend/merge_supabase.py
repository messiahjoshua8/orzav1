import os
import httpx
import logging
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Dict, List, Optional, Any

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Merge API configuration
MERGE_API_KEY = os.getenv("MERGE_API_KEY")
MERGE_API_BASE_URL = "https://api.merge.dev/api"

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Initialize Supabase client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    supabase = None

async def get_candidates(account_token: str, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Fetch candidates from the Merge ATS API
    
    Args:
        account_token (str): The Merge account token
        limit (int, optional): Maximum number of records to retrieve. Defaults to 100.
        offset (int, optional): Pagination offset. Defaults to 0.
        
    Returns:
        List[Dict[str, Any]]: List of candidate records
    """
    logger.info(f"Fetching candidates with limit {limit}, offset {offset}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{MERGE_API_BASE_URL}/ats/v1/candidates",
                headers={
                    "Authorization": f"Bearer {MERGE_API_KEY}",
                    "X-Account-Token": account_token,
                    "Content-Type": "application/json",
                },
                params={
                    "limit": limit,
                    "offset": offset
                }
            )
            
            if response.status_code != 200:
                error_message = f"Merge API error: {response.text}"
                logger.error(error_message)
                return []
            
            data = response.json()
            logger.info(f"Successfully fetched {len(data.get('results', []))} candidates")
            return data.get("results", [])
            
    except Exception as e:
        logger.error(f"Error fetching candidates: {str(e)}")
        return []

async def sync_candidates_to_supabase(account_token: str, table_name: str = "candidates") -> Dict[str, Any]:
    """
    Fetch candidates from Merge ATS and sync them to Supabase
    
    Args:
        account_token (str): The Merge account token
        table_name (str, optional): Supabase table name. Defaults to "candidates".
        
    Returns:
        Dict[str, Any]: Result summary
    """
    if not supabase:
        return {"success": False, "message": "Supabase client not initialized"}
    
    try:
        # Fetch candidates from Merge
        candidates = await get_candidates(account_token)
        
        if not candidates:
            return {"success": False, "message": "No candidates found or error fetching candidates"}
        
        # Transform candidates to make them Supabase-compatible
        transformed_candidates = []
        for candidate in candidates:
            # Format complex fields as JSON strings
            applications = json.dumps(candidate.get("applications", []))
            attachments = json.dumps(candidate.get("attachments", []))
            locations = json.dumps(candidate.get("locations", []))
            phone_numbers = json.dumps(candidate.get("phone_numbers", []))
            email_addresses = json.dumps(candidate.get("email_addresses", []))
            urls = json.dumps(candidate.get("urls", []))
            tags = json.dumps(candidate.get("tags", []))
            field_mappings = json.dumps(candidate.get("field_mappings", {}))
            
            # Add a merged_id field to use as a primary key
            transformed_candidate = {
                "merge_id": candidate.get("id", ""),
                "remote_id": candidate.get("remote_id", ""),
                "first_name": candidate.get("first_name", ""),
                "last_name": candidate.get("last_name", ""),
                "company": candidate.get("company", ""),
                "title": candidate.get("title", ""),
                "email": candidate.get("email_addresses", [{}])[0].get("value", "") if candidate.get("email_addresses") else "",
                "phone": candidate.get("phone_numbers", [{}])[0].get("value", "") if candidate.get("phone_numbers") else "",
                "location": candidate.get("locations", [""])[0] if candidate.get("locations") else "",
                "created_at": candidate.get("created_at", ""),
                "modified_at": candidate.get("modified_at", ""),
                "remote_created_at": candidate.get("remote_created_at", ""),
                "remote_updated_at": candidate.get("remote_updated_at", ""),
                "applications_json": applications,
                "attachments_json": attachments,
                "locations_json": locations,
                "phone_numbers_json": phone_numbers,
                "email_addresses_json": email_addresses,
                "urls_json": urls,
                "tags_json": tags,
                "field_mappings_json": field_mappings,
                "remote_was_deleted": candidate.get("remote_was_deleted", False),
            }
            transformed_candidates.append(transformed_candidate)
        
        # Insert or update candidates in Supabase
        logger.info(f"Upserting {len(transformed_candidates)} candidates to Supabase")
        
        # Try to create the table first if it doesn't exist
        try:
            # This is a simplified approach - in a production app, you'd want to use migrations
            logger.info(f"Checking if table {table_name} exists...")
            
            # Insert data with upsert operation
            result = supabase.table(table_name).upsert(
                transformed_candidates, 
                on_conflict="merge_id"
            ).execute()
            
            logger.info(f"Supabase upsert result: {result}")
            
        except Exception as table_error:
            logger.error(f"Table operation error: {str(table_error)}")
            return {"success": False, "message": f"Error: {str(table_error)}"}
        
        return {
            "success": True,
            "message": f"Successfully synced {len(transformed_candidates)} candidates to Supabase",
            "count": len(transformed_candidates)
        }
        
    except Exception as e:
        logger.error(f"Error syncing candidates to Supabase: {str(e)}")
        return {"success": False, "message": f"Error: {str(e)}"}

# Example usage
# if __name__ == "__main__":
#     import asyncio
#     result = asyncio.run(sync_candidates_to_supabase("your_account_token"))
#     print(result) 