# Use official python image
FROM python:3.10

# Set working directory called "fastapi"
WORKDIR /backend

# Copy packages at working directory
COPY ./requirements.txt .

# Install packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of application code at working directory
COPY . .

# Set PYTHONPATH so Python can find the backend module
ENV PYTHONPATH=/backend

# Use port 8000 (default port used in FastAPI)
EXPOSE 8000

# Run FastAPI
CMD ["fastapi", "run", "main.py", "--port", "8000"]
