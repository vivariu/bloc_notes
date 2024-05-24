document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");

  let allNotes = null;

  function getNotes() {
    if (allNotes === null) {
      allNotes = JSON.parse(localStorage.getItem("notes")) || {};
    }
    return allNotes;
  }

  function setNotesToLocalStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  if (noteList) {
    loadNotes(getNotes());
  }

  if (addNote) {
    addNote.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "detail.html";
    });
  }

  if (saveNote) {
    saveNote.addEventListener("click", SaveNote);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get("id");
  if (noteId) {
    loadNoteById(getNotes(), noteId);
  }

  function loadNotes(notes) {
    noteList.innerHTML = "";
    for (let id in notes) {
      const note = notes[id];
      const li = createNoteList(note);
      noteList.appendChild(li);
    }
  }

  function getNoteById(notes, id) {
    return notes[id];
  }

  function loadNoteById(notes, id) {
    const note = getNoteById(notes, id);
    if (title && noteEditor && note) {
      title.value = note.title;
      noteEditor.value = note.text;
    }
  }

  function saveNoteById(id, titleText, noteText) {
    const notes = getNotes();
    notes[id].title = titleText;
    notes[id].text = noteText;
    setNotesToLocalStorage(notes);
    window.location.href = "index.html";
  }

  function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteNoteById(id);
    });
    return deleteButton;
  }

  function deleteNoteById(id) {
    const notes = getNotes();
    delete notes[id];
    setNotesToLocalStorage(notes);
    loadNotes(notes);
  }

  function createNoteList(note) {
    const li = document.createElement("li");
    const deleteButton = createDeleteButton(note.id);
    const saveText = note.title
      ? note.title
      : note.text.split(" ").slice(0, 3).join(" ");
    li.textContent = saveText;
    li.addEventListener("click", () => {
      window.location.href = `detail.html?id=${note.id}`;
    });
    li.appendChild(deleteButton);
    return li;
  }

  function saveToLocalStorage(note) {
    const notes = getNotes();
    const uniqId = Math.floor(Date.now() / 1000);
    note.id = uniqId;
    notes[uniqId] = note;
    setNotesToLocalStorage(notes);
    window.location.href = "index.html";
    if (title) title.value = "";
    if (noteEditor) noteEditor.value = "";
    loadNotes(notes);
  }

  function SaveNote() {
    if (title && noteEditor) {
      const titleText = title.value.trim();
      const noteText = noteEditor.value.trim();
      const id = urlParams.get("id");
      if (titleText == "" && noteText == "") {
        window.location.href = "index.html";
      }
      if (id && titleText == "" && noteText == "") {
        deleteNoteById(id);
      }

      if (titleText || noteText) {
        if (id) {
          saveNoteById(id, titleText, noteText);
        } else {
          const note = { title: titleText, text: noteText };
          saveToLocalStorage(note);
        }
      }
    }
  }
});
