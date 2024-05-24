document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");

  let allNotes = getNotesFromLocalStorage();
  console.log(allNotes);

  if (noteList) {
    loadNotes(allNotes);
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
    loadNoteById(allNotes, noteId);
  }

  function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("notes")) || {};
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
    allNotes[id].title = titleText;
    allNotes[id].text = noteText;
    window.location.href = "index.html";
    setNotesToLocalStorage(allNotes);
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
    delete allNotes[id];
    setNotesToLocalStorage(allNotes);
    loadNotes(allNotes);
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
    const uniqId = Math.floor(Date.now() / 1000);
    allNotes[uniqId] = note;
    if (addNote) addNote.style.display = "block";
    window.location.href = "index.html";
    title.value = "";
    noteEditor.value = "";
    setNotesToLocalStorage(allNotes);
  }

  function SaveNote() {
    if (title && noteEditor) {
      const titleText = title.value.trim();
      const noteText = noteEditor.value.trim();
      const id = urlParams.get("id");
      if (titleText == "" && noteText == "") {
        window.location.href = "index.html";
      }
      if (titleText == "" && noteText == "") {
        if (id) {
          deleteNoteById(id, titleText, noteText);
        }
      }

      if (titleText || noteText) {
        if (id) {
          saveNoteById(id, titleText, noteText);
        } else {
          const uniqId = Math.floor(Date.now() / 1000);
          const note = { id: uniqId, title: titleText, text: noteText };
          saveToLocalStorage(note);
          loadNotes(allNotes);
        }
      }
    }
  }
});
