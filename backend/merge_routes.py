from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
import asyncio
from typing import Optional, Dict, Any, List

from merge_supabase import get_candidates, sync_candidates_to_supabase

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/merge-supabase", tags=["merge-supabase"])

class SyncRequest(BaseModel):
    account_token: str
    table_name: Optional[str] = "candidates"
    limit: Optional[int] = 100
    offset: Optional[int] = 0

@router.post("/fetch-candidates")
async def fetch_candidates(request: SyncRequest):
    """
    Fetch candidates from Merge ATS using the provided account token
    """
    logger.info(f"Fetching candidates with account token ending in ...{request.account_token[-4:]}")
    
    try:
        candidates = await get_candidates(
            account_token=request.account_token,
            limit=request.limit,
            offset=request.offset
        )
        
        if not candidates:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "No candidates found or error fetching data"}
            )
        
        return {
            "success": True,
            "count": len(candidates),
            "data": candidates
        }
        
    except Exception as e:
        logger.error(f"Error fetching candidates: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

@router.post("/sync-candidates")
async def sync_candidates(request: SyncRequest):
    """
    Sync candidates from Merge ATS to Supabase
    """
    logger.info(f"Syncing candidates to Supabase table {request.table_name}")
    
    try:
        result = await sync_candidates_to_supabase(
            account_token=request.account_token,
            table_name=request.table_name
        )
        
        if not result.get("success", False):
            return JSONResponse(
                status_code=400,
                content=result
            )
        
        return result
        
    except Exception as e:
        logger.error(f"Error syncing candidates: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

@router.post("/get-transformed-candidates")
async def get_transformed_candidates(request: SyncRequest):
    """
    Get transformed candidates ready for Supabase insertion
    """
    logger.info(f"Getting transformed candidates for account token ending in ...{request.account_token[-4:]}")
    
    try:
        from merge_supabase import get_candidates, json
        
        # Fetch candidates from Merge
        candidates = await get_candidates(
            account_token=request.account_token,
            limit=request.limit,
            offset=request.offset
        )
        
        if not candidates:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "No candidates found or error fetching data"}
            )
            
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
        
        # Return transformed candidates
        return {
            "success": True,
            "count": len(transformed_candidates),
            "table_structure": list(transformed_candidates[0].keys()) if transformed_candidates else [],
            "data": transformed_candidates[:5]  # Return only first 5 to keep response size manageable
        }
        
    except Exception as e:
        logger.error(f"Error transforming candidates: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        ) 