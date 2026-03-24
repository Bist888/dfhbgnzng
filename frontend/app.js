const API = 'http://localhost:8000/api';


async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Ошибка сервера');
  return data;
}


const usersList  = document.getElementById('users-list');
const usersForm  = document.getElementById('users-form');
const userInput  = document.getElementById('user-input');
const usersError = document.getElementById('users-error');

async function loadUsers() {
  const users = await api('/users/');
  usersList.innerHTML = '';
  users.forEach(({ id, name }) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `#${id} — ${name}`;

    
    const del = document.createElement('button');
    del.className = 'del-btn';
    del.textContent = '✕';
    del.title = 'Удалить';
    del.addEventListener('click', async () => {
      await api(`/users/${id}`, { method: 'DELETE' });
      await loadUsers();
    });

    li.append(span, del);
    usersList.append(li);
  });
}

usersForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  usersError.textContent = '';
  try {
  
    await api('/users/', {
      method: 'POST',
      body: JSON.stringify({ name: userInput.value }),
    });
    userInput.value = '';
    await loadUsers();
  } catch (err) {
    usersError.textContent = err.message;
  }
});


const notesList  = document.getElementById('notes-list');
const notesForm  = document.getElementById('notes-form');
const noteInput  = document.getElementById('note-input');
const notesError = document.getElementById('notes-error');

async function loadNotes() {
  const notes = await api('/notes/');
  notesList.innerHTML = '';
  notes.forEach(({ id, text }) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = text;


    const del = document.createElement('button');
    del.className   = 'del-btn';
    del.textContent = '✕';
    del.title       = 'Удалить';
    del.addEventListener('click', async () => {
      await api(`/notes/${id}`, { method: 'DELETE' });
      await loadNotes();
    });

    li.append(span, del);
    notesList.append(li);
  });
}

notesForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  notesError.textContent = '';
  try {
    await api('/notes/', {
      method: 'POST',
      body: JSON.stringify({ text: noteInput.value }),
    });
    noteInput.value = '';
    await loadNotes();
  } catch (err) {
    notesError.textContent = err.message;
  }
});


loadUsers();
loadNotes();
