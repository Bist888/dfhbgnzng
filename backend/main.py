from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import users, notes

app = FastAPI(title="FastAPI Demo")

# CORS — разрешаем запросы с любого origin (для разработки)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры под префикс /api
app.include_router(users.router, prefix="/api")
app.include_router(notes.router, prefix="/api")

# Раздаём фронтенд из ../frontend
frontend = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend, html=True), name="static")
