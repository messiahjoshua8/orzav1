from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv

# Import the original app
import main as original_app

# Import our new routes
from merge_routes import router as merge_supabase_router

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create the combined app
app = FastAPI(title="Merge API Integration")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the original routes
@app.get("/health")
async def health_check():
    return await original_app.health_check()

@app.post("/create-link-token")
async def create_link_token(request: original_app.LinkTokenRequest):
    return await original_app.create_link_token(request)

@app.post("/exchange-token")
async def exchange_token(request: original_app.TokenRequest):
    return await original_app.exchange_token(request)

# Include the new routes
app.include_router(merge_supabase_router)

# Add documented constants for linked account info
MERGE_LINKED_ACCOUNT_ID = os.getenv("MERGE_LINKED_ACCOUNT_ID", "f2f797a5-b45a-4ac8-a7bf-31f4ca91d095")
MERGE_LINKED_ACCOUNT_TOKEN = os.getenv("MERGE_LINKED_ACCOUNT_TOKEN", "ZHpX1K-o1l0tbLomOcfMlvyfJeGZtAWYaG5cuNWNDoavq3Xn4JNEJw")

@app.get("/linked-account-info")
async def get_linked_account_info():
    """
    Get the linked account information for easy reference
    """
    return {
        "linked_account_id": MERGE_LINKED_ACCOUNT_ID,
        "account_token": MERGE_LINKED_ACCOUNT_TOKEN
    } 