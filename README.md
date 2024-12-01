# Workout Tracker Command Line Interface

![License Static Badge](https://img.shields.io/badge/license-MIT-orange)

![workout-cli-screenshot](https://github.com/user-attachments/assets/ef1b6edd-ad08-439d-b675-345218ced844)

## Description

A web-based shell command line interface for tracking workout sessions.

### Technology used

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn
- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy
- Security: NextAuth.js, OAuth2, Google reCAPTCHA v3

### Motivation

As a gym-goer and programmer, I wanted to create a workout entry logger specifically for myself and fellow programmers. In order to access this logger at the gym, I decided to make this CLI web-based, usable on desktops and mobile devices.

### In progress

- Testing: Jest for JS testing
- Deployment: Vercel for Next.js, Render for FastAPI, and RDS for postgres
- Documentation: Update README to see how to generate environment variables for frontend and backend
- Backend: Refactor SQLAlchemy to use SQLModel (better integrates to FastAPI, as it is built on top of SQLAlchemy)

## Running the application for development

### Prerequisites

- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).
- Create the `.env` files as instructed in the `backend` and `frontend` directories

### Steps

1. Start the containers:

   ```
   docker-compose up --build
   ```

2. Access the applications locally:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000/docs](http://localhost:8000/docs)
3. Stop the containers:
   ```
   docker-compose down
   ```

## `wit` CLI

`wit`, inspired by `git` version control, helps keep track of your workout/exercise entries in a command line interface. In other words, it is the _git_ for _workouts_, hence the name.

### Command Reference

`wit add`

- Start a workout session.

`wit commit -m <message>`

- End and record workout session with message that describes the session.

`wit status`

- Displays start time of workout session, if workout in progress.

`wit reset`

- Forgets current workout session, if workout started.

`wit reset --delete <YYYY-MM-DD>`

- Deletes all the workout commits on the specified day at **YYYY-MM-DD**

`wit log`

- Show commits of workout entries
- Include the `--year-month <YYYY-MM>` option to display logs of a specified month

`wit log --oneline`

- Shows commits of workout entries in compacted format
- Add the `--year-month <YYYY-MM>` option to display logs of a specified month

`wit log --week`

- Displays a graph of commits of workout entries of current calendar week

`wit log --month`

- Displays a graph of commits of workout entries of current calendar month
- Add the `--year-month <YYYY-MM>` option to display logs of a specified month

`wit --help`

- Show detailed information about `wit`

## License

MIT License.
