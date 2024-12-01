# FastAPI backend for Workout Command Line Interface

## File structure

```
.
├── backend
│   ├── __init__.py        # "backend" package
│   ├── auth.py            # authentication endpoints
│   ├── config.py          # configures env vars
│   ├── crud.py            # SQLAlchemy query functions
│   ├── database.py        # creates SQLAlchemy database
│   ├── main.py            # main endpoints
│   ├── models.py          # Pydantic model for type validation
│   ├── schemas.py         # SQLAlchemy schema
│   │
│   └── tests
│   │   ├── __init__.py    # "tests" subpackage
│   │   ├── conftest.py    # fixtures file
│   │   ├── inputs.py      # inputs for route unit tests
│   │   ├── test_auth.py   # unit tests for "/auth" endpoints
│   │   ├── test_main.py   # unit tests for non-auth endpoints
│   │   └── utils.py       # additional misc. functions
│   │
│   ├── .dockerignore      # ignore file for Docker image
│   ├── .env.example       # template for .env file
│   ├── .gitignore         # ignore file for GitHub repo
│   ├── Dockerfile         # to build Docker image
│   ├── README.md          # this file
│   └── requirements.txt   # dependencies
```

## How to generate .env file from .env.example file

1. Create a file called `.env` that has the same environment variables from the `.env.example` file. In Linux/Unix, you can use the following command:

   ```
   $ cp ./.env.example ./.env
   ```

2. For the `SECRET_KEY` variable, generate it in Linux/Unix using the following command:

   ```
   openssl rand -hex 32
   ```

   - **Note**: Make sure the `SECRET_KEY` variable is the same as the `NEXTAUTH_SECRET` variable in the `.env` file at `../frontend`.
