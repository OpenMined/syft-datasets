# Guidelines for new commands
# - Start with a verb
# - Keep it short (max. 3 words in a command)
# - Group commands by context. Include group name in the command name.
# - Mark things private that are util functions with [private] or _var
# - Don't over-engineer, keep it simple.
# - Don't break existing commands
# - Run just --fmt --unstable after adding new commands

set dotenv-load := true

# ---------------------------------------------------------------------------------------------------------------------
# Private vars

_red := '\033[1;31m'
_cyan := '\033[1;36m'
_green := '\033[1;32m'
_yellow := '\033[1;33m'
_nc := '\033[0m'

# ---------------------------------------------------------------------------------------------------------------------
# Aliases

alias rs := prod

# ---------------------------------------------------------------------------------------------------------------------

@default:
    just --list

[group('dev')]
dev config_path="":
    #!/bin/bash
    set -euo pipefail

    # if the config_path is not empty string, set syftbox client config path
    if [ "{{config_path}}" != "" ]; then
        echo "${_green}Using custom config path: ${config_path}${_nc}"
        export SYFTBOX_CLIENT_CONFIG_PATH="${config_path}"
    fi

    # concurrently run the server and frontend
    bunx concurrently --names "server,frontend" --prefix-colors "red,green" \
        "uv run uvicorn backend.main:app --reload --port 8001" \
        "NEXT_PUBLIC_API_URL=http://localhost:8001 bun run --cwd frontend dev"

[group('server')]
prod config_path="":
    #!/bin/bash
    set -euo pipefail

    # if the config_path is not empty string, set syftbox client config path
    if [ "{{config_path}}" != "" ]; then
        echo "${_green}Using custom config path: ${config_path}${_nc}"
        export SYFTBOX_CLIENT_CONFIG_PATH="${config_path}"
    fi

    # build the frontend
    bun run --cwd frontend build
    uv run uvicorn backend.main:app

[group('frontend')]
install-frontend:
    bun install --cwd frontend

build-frontend:
    bun run --cwd frontend build

[group('backend')]
install-backend:
    uv sync

run-backend:
    uv run uvicorn backend.main:app --reload --port 8001 