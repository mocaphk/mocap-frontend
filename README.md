# mocap frontend

[![Build Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/build.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/build.yaml)
[![Eslint Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/eslint.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/eslint.yaml)
[![Format Badge](https://github.com/mocaphk/mocap-frontend/actions/workflows/format.yaml/badge.svg)](https://github.com/mocaphk/mocap-frontend/actions/workflows/format.yaml)

## Contributing

Please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) when you commit!

Please install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint), [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) VSCode extensions.

For ESLint, please add these to your `settings.json` in VSCode:

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

For Tailwind CSS IntelliSense, please add these to your `settings.json` in VSCode:

```json
    "files.associations": {
        "*.css": "tailwindcss"
    },
    "editor.quickSuggestions": {
    "strings": "on"
    }
```
