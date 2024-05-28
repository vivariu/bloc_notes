document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");
  const noteEditor = document.getElementById("note_editor");

  let allNotes = null;
  let editNoteId = null;

  function getNotes() {
    if (allNotes === null) {
      allNotes = JSON.parse(localStorage.getItem("notes")) || {};
    }
    return allNotes;
  }

  function setNotesToLocalStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function loadNotes(notes) {
    noteList.innerHTML = "";
    for (let id in notes) {
      const note = notes[id];
      const li = createNoteList(note);
      noteList.appendChild(li);
    }
  }

  function createNoteList(note) {
    const li = document.createElement("li");
    const deleteButton = createDeleteButton(note.id);
    const saveText = note.title
      ? note.title
      : note.text.split(" ").slice(0, 3).join(" ");
    li.textContent = saveText;
    li.addEventListener("click", () => {
      editNoteId = note.id;
      loadNoteById(getNotes(), note.id);
      history.pushState(null, null, `?id=${note.id}`);
    });
    li.appendChild(deleteButton);
    return li;
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

  function loadNoteById(notes, id) {
    const note = notes[id];
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
    loadNotes(notes);
  }

  function saveToLocalStorage(note) {
    const notes = getNotes();
    const uniqId = Math.floor(Date.now() / 1000);
    note.id = uniqId;
    notes[uniqId] = note;
    setNotesToLocalStorage(notes);
    loadNotes(notes);
  }

  function SaveNote() {
    if (title && noteEditor) {
      const titleText = title.value.trim();
      const noteText = noteEditor.value.trim();
      if (titleText == "" && noteText == "") {
        hideEditor();
        return;
      }
      if (editNoteId) {
        if (titleText == "" && noteText == "") {
          deleteNoteById(editNoteId);
        } else {
          saveNoteById(editNoteId, titleText, noteText);
        }
      } else {
        const note = { title: titleText, text: noteText };
        saveToLocalStorage(note);
      }
    }
  }

  if (addNote) {
    addNote.addEventListener("click", (event) => {
      event.preventDefault();
      editNoteId = null;
      title.value = "";
      noteEditor.value = "";
    });
  }

  if (saveNote) {
    saveNote.addEventListener("click", SaveNote);
  }

  loadNotes(getNotes());

  const firstNote = document.querySelector("#notes_list li");
  if (firstNote) {
    firstNote.click();
  }
});
