import os
from botocore.exceptions import NoCredentialsError, BotoCoreError
from dotenv import load_dotenv
from backend.aws.ssm import get_aws_parameters

def load_env_file():
    """
    Load environment variables from a local .env file.
    """
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(".env file loaded successfully.")
    else:
        raise FileNotFoundError(".env file not found.")

def load_env_vars():
    """
    Initialize environment variables from AWS or fallback to .env file.
    """
    try:
        # Attempt to load AWS parameters first
        get_aws_parameters("/git-fit/")
    except (NoCredentialsError, BotoCoreError) as e:
        print(f"Falling back to .env file due to AWS error: {e}")
        try:
            load_env_file()
        except FileNotFoundError as env_error:
            print(f"Critical Error: {env_error}")
            raise

# Initialize environment variables
load_env_vars()

# Environment variables
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_SERVER = os.getenv("POSTGRES_SERVER")
POSTGRES_DB = os.getenv("POSTGRES_DB")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Check if all environment variables are loaded
required_vars = {
    "POSTGRES_USER": POSTGRES_USER,
    "POSTGRES_PASSWORD": POSTGRES_PASSWORD,
    "POSTGRES_SERVER": POSTGRES_SERVER,
    "POSTGRES_DB": POSTGRES_DB,
    "SECRET_KEY": SECRET_KEY,
    "ALGORITHM": ALGORITHM,
}
for var_name, value in required_vars.items():
    if not value:
        raise KeyError(f"Missing required environment variable: {var_name}")
