# Welcome to Mootfight!
An open-source self-hosted Artfight clone. (name tentative...)

# Frontend
## Dev Setup
Only required if you're contributing to the codebase! Also, do everything mentioned in **Hosting Setup.**
### Install
1. Pull repo
2. cd into ``frontend`` folder
3. ``npm install``

### Common Issues
- Please use getProfileLink(), sanitize() and getPfp() helper functions. They do the parsing so data doesn't throw errors.


## Deployment
(to implement: https://github.com/gitname/react-gh-pages)
``npm run deploy``


# Backend

### Initial Setup
1. Download Pocketbase and drop the .exe into `backend` folder: https://github.com/pocketbase/pocketbase/releases/tag/v0.33.0
  - Current version of Pocketbase we're developing with is 0.33.0; higher versions have not been tested so use at your own risk (there may be some schema changes)
2. cd into `backend`, run cmd
3. `pocketbase serve` or `./pocketbase serve`
4. Set up your superuser
5. Import the tables under Settings -> Sync -> Import Collections -> select `backend/init.json`
6. (Optional) if you already have data, it should be inside a `pb_data` folder. Unzip it and drag into the backend folder.

(TODO: better elaboration on file structure)

## Deployment
Transfer the files in backend (`pocketbase.exe`, `pb_data`, `pb_hooks`, and `pb_migration`) into your hosting service of choice.

Run `pocketbase serve`

Edit frontend .env to match backend API, and redeploy frontend.

# Misc

### Note to Contributors
PRs are welcome! But please don't make PRs with AI generated code, thanks