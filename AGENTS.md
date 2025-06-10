# AGENT Instructions

These guidelines apply to the entire repository.

- Prefer Python 3.10+ syntax.
- Use FastAPI for API implementation.
- Format Python code in the `api/` directory with `ruff` using `uvx ruff format`.
- Run `uvx ruff check` for linting API files.
- Format and lint the `ui/` directory with Biome using `npx @biomejs/biome check --write .`.
- Include unit tests with `pytest` for new Python code when possible.
- Programmatic checks: run `pytest` from the repository root before committing.
