# Use uv's Python image for faster installs
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

WORKDIR /app

# Enable bytecode compilation and copy linking
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install dependencies without project code for better caching
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project --no-dev

# Copy application source and install the project
COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Add venv executables to PATH
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
