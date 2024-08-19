# Workout CLI

![License Static Badge](https://img.shields.io/badge/license-MIT-orange)

## Description

### Technology used

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn
- Backend: Python, FastAPI, PostgreSQL, SQLAlchemy
- Security: NextAuth.js, OAuth2, Google reCAPTCHA v3

### Motivation

As a gym-goer and programmer, I wanted to create a workout entry logger specifically for myself and fellow programmers. In order to access this logger at the gym, I decided to make this CLI web-based, usable on desktops and mobile devices.

### In progress

- Testing: `TestClient` for FastAPI and jest for JS testing
- Containerization: Update Dockerfile for _backend_ and add Dockerfile for _frontend_. Need to add docker-compose file as well.
- DevOps: CI/CD pipeline with GitHub Actions. Deployment on AWS or Vercel for frontend and RDS + EC2 for backend

## `wit` interface

`wit`, inspired by `git` version control, helps keep track of your workout/exercise entries in a command line interface. In other words, it is the _git_ for _workouts_, hence the name.

### Commands

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
