import requests
import json
import os
from jose import jwt
from datetime import datetime, timedelta

# Configuration (matching .env)
JWT_SECRET = "super-secret-hipaa-key"
JWT_ALGORITHM = "HS256"
DOC_SERVICE_URL = "http://localhost:8006"

def generate_token(worker_id):
    payload = {
        "sub": worker_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def test_unauthorized():
    print("\n--- Testing Unauthorized Access ---")
    data = {
        "session_id": "sess-999",
        "file_name": "lab_results.pdf",
        "action": "download",
        "worker_id": "worker-1"
    }
    response = requests.post(f"{DOC_SERVICE_URL}/generate-presigned-url", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    assert response.status_code == 401

def test_authorized():
    print("\n--- Testing Authorized Access ---")
    token = generate_token("worker-1")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "session_id": "sess-test-123",
        "file_name": "patient_scan.jpg",
        "action": "upload",
        "worker_id": "worker-1"
    }
    response = requests.post(f"{DOC_SERVICE_URL}/generate-presigned-url", json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Got pre-signed URL:")
        print(response.json())
    else:
        print(f"Failed: {response.text}")
    assert response.status_code == 200

if __name__ == "__main__":
    try:
        test_unauthorized()
        test_authorized()
        print("\n✅ Verification Complete!")
    except Exception as e:
        print(f"\n❌ Verification Failed: {e}")
