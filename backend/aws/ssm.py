import os
import boto3
from botocore.exceptions import NoCredentialsError, BotoCoreError

# Cache for AWS parameters to minimize redundant API calls
_cached_parameters = None

def get_aws_parameters(path: str):
    """
    Fetch multiple parameters from AWS Parameter Store and load them into environment variables.
    Cached to avoid redundant calls.
    """
    global _cached_parameters
    if _cached_parameters is not None:
        print("Using cached AWS parameters.")
        for key, value in _cached_parameters.items():
            os.environ[key] = value
        return

    try:
        ssm_client = boto3.client("ssm", region_name=os.getenv("AWS_REGION", "us-west-1"))
        paginator = ssm_client.get_paginator("get_parameters_by_path")

        parameters = {}
        for page in paginator.paginate(Path=path, Recursive=True, WithDecryption=True):
            for param in page["Parameters"]:
                key = param["Name"].split("/")[-1]
                value = param["Value"]
                parameters[key] = value
                os.environ[key] = value

        _cached_parameters = parameters  # Cache the loaded parameters
        print("AWS parameters loaded and cached successfully.")
    except (NoCredentialsError, BotoCoreError) as e:
        print(f"AWS Warning: Failed to fetch parameters for prefix {path}. {e}")
        raise  # Re-raise the exception to trigger fallback
