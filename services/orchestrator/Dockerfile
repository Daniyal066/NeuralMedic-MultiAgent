FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for psycopg2 compilation if we were using the source version, but binary is fine)
# kept minimal for slim image

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
