document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");

  if (noteList) {
    loadNotes();
  }

  if (saveNote) {
    saveNote.addEventListener("click", () => {
      if (title && noteEditor) {
        const titleText = title.value.trim();
        const noteText = noteEditor.value.trim();
        const url = new URL(location.href);
        const id = url.searchParams.get("id");

        if (titleText || noteText) {
          if (id) {
            saveNoteById(id, titleText, noteText);
          } else {
            const uniqId = Math.floor(Date.now() / 1000);
            const note = { id: uniqId, title: titleText, text: noteText };
            saveToLocalStorage(note);
            loadNotes();
            noteList.appendChild(li);
          }
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
      let parsedNotes = JSON.parse(notes);
      let note = parsedNotes.find((note) => note.id == id);
      if (title && noteEditor && note) {
        title.value = note.title;
        noteEditor.value = note.text;
      }
    }
  }

  function saveNoteById(id, titleText, noteText) {
    const notes = localStorage.getItem("notes");
    if (notes) {
      let parsedNotes = JSON.parse(notes);
      let noteId = parsedNotes.findIndex((note) => note.id == id);
      parsedNotes[noteId].title = titleText;
      parsedNotes[noteId].text = noteText;
      localStorage.setItem("notes", JSON.stringify(parsedNotes));
    }
  }

  function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteById(id);
    });
    return deleteButton;
  }

  function deleteById(id) {
    const notes = localStorage.getItem("notes");
    if (notes) {
      let parsedNotes = JSON.parse(notes);
      let noteId = parsedNotes.filter((note) => note.id != id);
      localStorage.setItem("notes", JSON.stringify(noteId));
      loadNotes();
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
      let parsedNotes = JSON.parse(notes);
      noteList.innerHTML = "";
      parsedNotes.forEach((note) => {
        const li = document.createElement("li");
        const deleteButton = createDeleteButton(note.id);
        const saveText = note.title
          ? note.title
          : note.text.split(" ").slice(0, 3).join(" ");
        li.textContent = saveText;
        li.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = `detail.html?id=${note.id}`;
        });

        li.appendChild(deleteButton);
        noteList.appendChild(li);
      });
    }
  }
});
