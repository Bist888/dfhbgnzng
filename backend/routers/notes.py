from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/notes", tags=["notes"])

db: list[dict] = [
    {"id": 1, "text": "Выучить FastAPI"},
    {"id": 2, "text": "Сделать проект"},
]
next_id = 3


class NoteIn(BaseModel):
    text: str


@router.get("/")
def get_notes():
    return db


@router.post("/", status_code=201)
def add_note(body: NoteIn):
    global next_id
    if not body.text.strip():
        raise HTTPException(400, "Текст не может быть пустым")
    note = {"id": next_id, "text": body.text.strip()}
    db.append(note)
    next_id += 1
    return note


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int):
    global db
    before = len(db)
    db = [n for n in db if n["id"] != note_id]
    if len(db) == before:
        raise HTTPException(404, "Заметка не найдена")
