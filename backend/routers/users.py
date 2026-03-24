from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

# "База" — просто список в памяти
db: list[dict] = [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"},
]
next_id = 3


class UserIn(BaseModel):
    name: str


@router.get("/")
def get_users():
    return db


@router.post("/", status_code=201)
def add_user(body: UserIn):
    global next_id
    if not body.name.strip():
        raise HTTPException(400, "Имя не может быть пустым")
    user = {"id": next_id, "name": body.name.strip()}
    db.append(user)
    next_id += 1
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int):
    global db
    before = len(db)
    db = [u for u in db if u["id"] != user_id]
    if len(db) == before:
        raise HTTPException(404, "Пользователь не найден")