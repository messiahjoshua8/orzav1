from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
import traceback
import json
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS - allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LinkTokenRequest(BaseModel):
    end_user_origin_id: str
    end_user_organization_name: str
    end_user_email_address: str
    categories: List[str]

class TokenRequest(BaseModel):
    public_token: str
    user_id: str
    organization_id: str

# Merge API configuration
MERGE_API_KEY = os.getenv("MERGE_API_KEY")
MERGE_API_BASE_URL = "https://api.merge.dev/api"

if not MERGE_API_KEY:
    logger.error("MERGE_API_KEY environment variable is not set")
    raise ValueError("MERGE_API_KEY environment variable is not set")

logger.info(f"Backend initialized with MERGE_API_BASE_URL: {MERGE_API_BASE_URL}")
logger.info(f"Using MERGE_API_KEY (last 4 chars): ...{MERGE_API_KEY[-4:]}")

@app.post("/create-link-token")
async def create_link_token(request: LinkTokenRequest):
    logger.info(f"Creating link token for user: {request.end_user_email_address}")
    logger.debug(f"Full request data: {request.dict()}")
    
    try:
        request_data = {
            "end_user_origin_id": request.end_user_origin_id,
            "end_user_organization_name": request.end_user_organization_name,
            "end_user_email_address": request.end_user_email_address,
            "categories": request.categories,
        }
        logger.debug(f"Request data for Merge API: {request_data}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{MERGE_API_BASE_URL}/integrations/create-link-token",
                headers={
                    "Authorization": f"Bearer {MERGE_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=request_data,
            )
            
            logger.debug(f"Response status code: {response.status_code}")
            
            if response.status_code != 200:
                error_message = f"Merge API error: {response.text}"
                logger.error(error_message)
                return JSONResponse(status_code=response.status_code, content={"detail": error_message})
            
            result = response.json()
            logger.info("Successfully created link token")
            return result
            
    except Exception as e:
        error_detail = f"Server error: {str(e)}"
        logger.error(error_detail)
        logger.error(traceback.format_exc())
        return JSONResponse(status_code=500, content={"detail": error_detail})

@app.post("/exchange-token")
async def exchange_token(request: TokenRequest):
    logger.info(f"Received token exchange request for user_id: {request.user_id}")
    try:
        async with httpx.AsyncClient() as client:
            # Exchange public token for account token
            logger.info("Attempting to exchange public token for account token")
            
            response = await client.get(
                f"{MERGE_API_BASE_URL}/integrations/account-token/{request.public_token}",
                headers={
                    "Authorization": f"Bearer {MERGE_API_KEY}",
                    "Content-Type": "application/json",
                },
            )
            
            if response.status_code != 200:
                error_message = f"Merge API error: {response.text}"
                logger.error(error_message)
                return JSONResponse(status_code=response.status_code, content={"detail": error_message})
            
            account_token_data = response.json()
            account_token = account_token_data.get("account_token")
            logger.info("Successfully exchanged public token for account token")
            
            # Fetch some example data using the account token
            logger.info("Attempting to fetch data from Merge API")
            data_response = await client.get(
                f"{MERGE_API_BASE_URL}/ats/v1/jobs",
                headers={
                    "Authorization": f"Bearer {MERGE_API_KEY}",
                    "X-Account-Token": account_token,
                    "Content-Type": "application/json",
                }
            )
            
            if data_response.status_code != 200:
                logger.warning(f"Could not fetch data: {data_response.text}")
                return {
                    "account_token": account_token,
                    "message": "Successfully connected, but no data available"
                }
            
            logger.info("Successfully fetched data from Merge API")
            return {
                "account_token": account_token,
                "data": data_response.json()
            }
            
    except Exception as e:
        error_detail = f"Server error: {str(e)}"
        logger.error(error_detail)
        logger.error(traceback.format_exc())
        return JSONResponse(status_code=500, content={"detail": error_detail})

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"} 