document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");

  if (noteList) {
    loadNotes();
  }

  if (addNote) {
    addNote.addEventListener("click", () => {
      if (noteEditor) noteEditor.style.display = "block";
      if (saveNote) saveNote.style.display = "block";
      addNote.style.display = "none";
    });
  }

  if (saveNote) {
    saveNote.addEventListener("click", () => {
      if (noteEditor) {
        const noteText = noteEditor.value.trim();
        const url = new URL(location.href);
        const id = url.searchParams.get("id");

        if (noteText !== "") {
          if (id) {
            saveNoteById(id, noteText);
          } else {
            const uniqId = Math.floor(Date.now() / 1000);
            const note = { text: noteText, id: uniqId };
            saveToLocalStorage(note);
            const li = document.createElement("li");
            li.textContent = `${note.text} ${note.id}`;
            if (noteList) noteList.appendChild(li);
          }

          noteEditor.value = "";
          noteEditor.style.display = "none";
          saveNote.style.display = "none";
          if (addNote) addNote.style.display = "block";
        }
      }
    });
  }

  if (window) {
    const url = new URL(location.href);
    const id = url.searchParams.get("id");
    if (id) {
      loadNoteById(id);
    }
  }

  function loadNoteById(id) {
    const notes = localStorage.getItem("notes");
    if (notes) {
      const parsedNotes = JSON.parse(notes);
      const note = parsedNotes.find((note) => note.id == id);
      if (noteEditor && note) {
        noteEditor.value = note.text;
        noteEditor.style.display = "block";
        saveNote.style.display = "block";
      }
    }
  }

  function saveNoteById(id, newText) {
    const notes = localStorage.getItem("notes");
    if (notes) {
      const parsedNotes = JSON.parse(notes);
      const noteId = parsedNotes.findIndex((note) => note.id == id);
      parsedNotes[noteId].text = newText;
      localStorage.setItem("notes", JSON.stringify(parsedNotes));
    }
  }

  function saveToLocalStorage(note) {
    let notes = localStorage.getItem("notes");
    if (!notes) {
      notes = [];
    } else {
      notes = JSON.parse(notes);
    }
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function loadNotes() {
    const notes = localStorage.getItem("notes");
    if (notes) {
      const parsedNotes = JSON.parse(notes);
      noteList.innerHTML = "";
      parsedNotes.forEach((note) => {
        const li = document.createElement("li");
        li.textContent = `${note.text} ${note.id}`;
        li.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = `detail.html?id=${note.id}`;
        });
        noteList.appendChild(li);
      });
    }
  }
});
