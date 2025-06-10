from fastapi import FastAPI

from .routers import extract, geocode, health

app = FastAPI(title="Address Mapper API", version="1")

app.include_router(health.router)
app.include_router(extract.router)
app.include_router(geocode.router)
