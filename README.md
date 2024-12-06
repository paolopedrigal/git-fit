# git-fit: Workout Tracker Command Line Interface

![License Static Badge](https://img.shields.io/badge/license-MIT-orange)

## Description

A web-based shell command line interface for tracking workout sessions.

### Technology used

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn
- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy
- Security: NextAuth.js, OAuth2, Google reCAPTCHA v3
- Infrastructure and Deployment: Docker, AWS (EC2, SSM), Vercel, Supabase, Nginx

### Motivation

As a gym-goer and programmer, I wanted to create a workout entry logger specifically for myself and fellow programmers. In order to access this logger at the gym, I decided to make this CLI web-based, usable on desktops and mobile devices.

### In progress

- Frontend:
  - Create command for outputting graph of year of logs
  - Allow user to customize color theme for shell
  - Fix hiding keyboard for mobile devices
- Backend:
  - Refactor SQLAlchemy to use SQLModel (better integrates to FastAPI, as it is built on top of SQLAlchemy)
  - Delete users after a year of inactiviy
  - Limit number of logs a user can add per day
- Cloud: Based on incoming traffic, put AWS EC2 instance in private subnet, configure NAT gateway, and set up a load balancer
- CI/CD: Set up GitHub Actions

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
3. Testing the application:
   1. Add/modify tests at `./backend/tests/` or `./frontend/tests/`
   2. Get the docker container ID of the running backend or frontend container:
      ```
      docker ps
      ```
   3. Enter in the running backend or frontend container id:
      ```
      docker exec -it <be_or_fe_container_id> /bin/bash
      ```
   4. Run the unit tests within the bash shell:
      - Backend:
        ```
        pytest ./tests/
        ```
      - Frontend:
        ```
        npm test
        ```
4. Stop the containers when finished:
   ```
   docker-compose down
   ```

## `fit` CLI

`fit`, inspired by `git` version control, helps keep track of your workout/exercise entries in a command line interface. In other words, it is the _git_ for _workouts_, hence the name.

### Command Reference

`fit add`

- Start a workout session.

`fit commit -m <message>`

- End and record workout session with message that describes the session.

`fit status`

- Displays start time of workout session, if workout in progress.

`fit reset`

- Forgets current workout session, if workout started.

`fit reset --delete <YYYY-MM-DD>`

- Deletes all the workout commits on the specified day at **YYYY-MM-DD**

`fit log`

- Show commits of workout entries
- Include the `--year-month <YYYY-MM>` option to display logs of a specified month

`fit log --oneline`

- Shows commits of workout entries in compacted format
- Add the `--year-month <YYYY-MM>` option to display logs of a specified month

`fit log --week`

- Displays a graph of commits of workout entries of current calendar week

`fit log --month`

- Displays a graph of commits of workout entries of current calendar month
- Add the `--year-month <YYYY-MM>` option to display logs of a specified month

`fit --help`

- Show detailed information about `fit`

## License

MIT License.
