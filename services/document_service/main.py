import os
import time
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel, Field
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-hipaa-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "medical-documents")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL", "http://localstack:4566")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# Logging setup (HIPAA Audit Trail)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - AUDIT - %(message)s'
)
logger = logging.getLogger("document_service")

app = FastAPI(title="Secure Document Service")
security = HTTPBearer()

class PresignedUrlRequest(BaseModel):
    session_id: str
    file_name: str
    action: str = Field(..., pattern="^(upload|download)$")
    worker_id: str

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        logger.warning(f"Invalid token attempt detected at {datetime.now()}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT_URL,
        region_name=AWS_REGION,
        config=Config(signature_version='s3v4')
    )

@app.post("/generate-presigned-url")
def generate_presigned_url(request: PresignedUrlRequest, token_payload: dict = Depends(verify_token)):
    s3_client = get_s3_client()
    
    # HIPAA Audit Log
    audit_data = {
        "timestamp": datetime.now().isoformat(),
        "worker_id": request.worker_id,
        "session_id": request.session_id,
        "file_name": request.file_name,
        "action": request.action,
        "authorized_by": token_payload.get("sub", "unknown")
    }
    logger.info(f"AUTHORIZED_URL_REQUEST: {audit_data}")

    object_name = f"{request.session_id}/{request.file_name}"

    try:
        if request.action == "upload":
            url = s3_client.generate_presigned_url(
                'put_object',
                Params={'Bucket': S3_BUCKET_NAME, 'Key': object_name},
                ExpiresIn=3600
            )
        else:
            url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': S3_BUCKET_NAME, 'Key': object_name},
                ExpiresIn=3600
            )
    except ClientError as e:
        logger.error(f"S3 Error for request {request}: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate URL")

    return {"url": url, "expires_in": 3600}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
