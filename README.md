# UoA Discords Website

[![Node.js CI](https://github.com/UoA-Discords/uoa-discords-website/actions/workflows/node.js.yml/badge.svg)](https://github.com/UoA-Discords/uoa-discords-website/actions/workflows/node.js.yml)[![Deploy](https://github.com/UoA-Discords/uoa-discords-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/UoA-Discords/uoa-discords-website/actions/workflows/deploy.yml)

Frontend website for the UoA Discords project.

## Installation

Dependencies:

-   [NodeJS](https://nodejs.org/en/) 16 or higher.

1. Clone this repository.
2. Install dependencies using [yarn](https://yarnpkg.com/) (preferred) or npm.

    ```sh
    # yarn
    $ yarn

    # npm
    npm install
    ```

3. Use `yarn start` (or `npm run start`) to start the application.

## Endpoint Overriding

If you want to use a different API endpoint to https://api.uoa-discords.com, you have 2 options:

1. Edit the [`src/config.json`](src/config.json) file's `serverURL` value, this gets annoying since GitHub will try to stage its changes.

2. Make a [`src/config-overrides.json`](src/config-overrides.json) file, with a `serverURL` field, this will be ignored by GitHub.

## Scripts

Run the scripts using `yarn <script>` or `npm run <script>`:

-   `typecheck` - Runs Typescript compiler typecheck.
-   `test` - Runs Jest tests.
-   `lint` - Runs basic React linting checks.
-   `check-all` - Runs all of the above (yarn only).
-   `build` - Compiles into bundled JavaScript.
-   `start` - Run in developer mode.
