document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditorContainer = document.getElementById("note_editor_container");
  const notesContainer = document.getElementById("notes_container");
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
      showEditor();
      loadNoteById(getNotes(), note.id);
      history.pushState({ noteId: note.id }, null, `?id=${note.id}`); // met a jour l'url avec l'id lorsque click
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

      if (editNoteId === id) {
        showNoteList();
        hideEditor();
      }
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
    hideEditor();
    loadNotes(notes);
    showNoteList();
  }

  function saveToLocalStorage(note) {
    if (note.title.trim() === "" && note.text.trim() === "") {
      return;
    }
    const notes = getNotes();
    const uniqId = Math.floor(Date.now() / 1000);
    note.id = uniqId;
    notes[uniqId] = note;
    setNotesToLocalStorage(notes);
    hideEditor();
    loadNotes(notes);
    showNoteList();
  }

  function SaveNote() {
    if (title && noteEditor) {
      const titleText = title.value.trim();
      const noteText = noteEditor.value.trim();
      if (titleText == "" && noteText == "") {
        hideEditor();
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

  function showNoteList() {
    editNoteId = null;
    history.pushState(null, null, window.location.pathname);
  }

  function showEditor() {
    notesContainer.style.display = "none";
    noteEditorContainer.style.display = "block";
  }

  function hideEditor() {
    notesContainer.style.display = "block";
    noteEditorContainer.style.display = "none";
  }

  window.addEventListener("popstate", (event) => {
    // gère la navition dans l'historique, lorsque qu'on click sur les boutons suivant ou précédent l'app se met a jour
    if (event.state && event.state.noteId) {
      editNoteId = event.state.noteId;
      showEditor();
      loadNoteById(getNotes(), editNoteId);
    } else {
      editNoteId = null;
      hideEditor();
    }
  });

  if (window.location.search) {
    // verification de l'url lors du chargement de la page, si Id present, la note est chargé sinon la page principale est chargé
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");
    if (noteId) {
      editNoteId = noteId;
      showEditor();
      loadNoteById(getNotes(), noteId);
    } else {
      hideEditor();
    }
  } else {
    hideEditor();
  }

  if (addNote) {
    addNote.addEventListener("click", (event) => {
      event.preventDefault();
      editNoteId = null;
      showEditor();
      title.value = "";
      noteEditor.value = "";
    });
  }

  if (saveNote) {
    saveNote.addEventListener("click", SaveNote);
  }

  loadNotes(getNotes());
});
