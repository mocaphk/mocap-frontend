# mocap-frontend

[![Build Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/build.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/build.yaml)
[![Eslint Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/eslint.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/eslint.yaml)
[![Format Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/format.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/format.yaml)

## What is MOCAP

![MOCAP demo](./.github/assets/demo.gif)

Multipurpose Online Coding Assessment Platform (MOCAP) is a web-based platform that aims to eliminate the need for students to individually configure their coding environments when completing course coding assignments.

To complete course coding assignments, students need to set up a coding environment on their local machines. However, issues might arise when setting up the environment due to discrepancies in libraries, dependencies, operating systems, and hardware. These differences can lead to problems when running assignments in markers' environments, resulting in disputes between students and teachers.

To address this problem, MOCAP provides a solution by hosting a web platform that offers a customizable coding environment using Docker. Docker ensures environment consistency and replicability, thereby eliminating the problems arising from discrepancies in libraries, dependencies, and operating systems.

## What is mocap-frontend

mocap-frontend is the frontend of our MOCAP system. It is written in TypeScript, React, Next.js 13, Tailwind CSS and GraphQL.

## Getting Started

### Production

1. Create a copy of `.env.production` and rename it as `.env.production.local`.

2. Fill in all required environment variables in `.env.production.local`.

3. Build the docker image.

    ```bash
    docker-compose build
    ```

4. Create a docker network `mocap` if you haven't already.

    ```bash
    docker network create mocap
    ```

5. Start the container.

    ```bash
    docker-compose up
    ```

### Development

1. Create a copy of `.env.development` and rename it as `.env.development.local`.

2. Fill in all required environment variables in `.env.development.local`.

3. Run the following commands:

    ```bash
    git submodule update
    npm install
    npm run compile
    npm run dev
    ```

-   If any GraphQL schema is updated, please run `npm run compile` again.

## Contributing

-   Please fork this repository and create a pull request if you want to contribute.

-   Please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) when you commit!

-   If you are using VSCode, you can install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint), [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extensions.

-   For ESLint, you can add these to your `settings.json` in VSCode:

    ```json
        "[javascript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            }
        },
        "[typescript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            }
        },
        "[typescriptreact]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            }
        },
        "[json]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode",
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            }
        },
        "eslint.validate": ["javascript", "typescript", "typescriptreact"]
    ```

-   For Tailwind CSS IntelliSense, please add these to your `settings.json` in VSCode:

    ```json
        "files.associations": {
            "*.css": "tailwindcss"
        },
        "editor.quickSuggestions": {
        "strings": "on"
        }
    ```

-   You can run `npm run format` to format your code.
