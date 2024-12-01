# Next.js frontend for Workout Command Line Interface

## File structure (Non-exhaustive)

```
.
├── frontend
│   ├── app                # source code of app
│   │   ├── (commands)     # "wit" commands
│   │   ├── api            # designated Next.js api folder
│   │   ├── credentials    # pages/layouts for credentials
│   ├── components         # react components folder
│   │   ├── ui             # shadcn ui components
│   ├── lib                # contains utilities
│   ├── public             # designated public folder
│   ├── types              # typing folder
│   ├── .dockerignore      # ignore file for Docker image
│   ├── .env.example       # template for .env file
│   ├── .gitignore         # ignore file for GitHub repo
│   ├── Dockerfile.dev     # to build Docker image
│   ├── package-lock.json  # dependencies
│   ├── package.json       # dependencies
│   └── README.md          # this file
```

## How to generate .env file from .env.example file

1. Create a file called `.env` that has the same environment variables from the `.env.example` file. In Linux/Unix, you can use the following command:

   ```
   $ cp ./.env.example ./.env
   ```

2. For the `NEXTAUTH_SECRET` variable, generate it in Linux/Unix using the following command:

   ```
   openssl rand -hex 32
   ```

   - **Note**: Make sure the `NEXTAUTH_SECRET` variable is the same as the `SECRET_KEY` variable in the `.env` file at `../backend`.

3. For the `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY`, sign up for an API key pair [here](https://developers.google.com/recaptcha/intro). Make sure you are using reCAPTCHA v3.
