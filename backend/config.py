import os
from dotenv import dotenv_values

# Determine the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the absolute path to the .env file
env_path = os.path.join(script_dir, ".env")

# Load the environment variables from the .env file
config = dotenv_values(env_path) 