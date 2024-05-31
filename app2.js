document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.querySelector(".add_note");
  const saveNote = document.querySelector(".save_note");
  const noteList = document.querySelector(".notes_list");
  const title = document.querySelector(".title");
  const noteEditor = document.querySelector(".note_editor");
  const containerCreateNote = document.querySelector(".container_create_note");
  const notesContainer = document.querySelector(".container");

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

    const textNode = document.createTextNode(stripHTML(saveText));
    li.appendChild(textNode);

    li.addEventListener("click", () => {
      editNoteId = note.id;
      loadNoteById(getNotes(), note.id);
      history.pushState(null, null, `?id=${note.id}`);
      if (window.innerWidth < 1365) {
        containerCreateNote.style.display = "block";
        notesContainer.style.display = "none";
      }
    });
    li.appendChild(deleteButton);
    return li;
  }

  // !!!!! Fonction pour supprimer les balises HTML du texte !!!!!!
  function stripHTML(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
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
      noteEditor.innerHTML = note.text;
    }
  }

  function saveNoteById(id, titleText, noteText) {
    const notes = getNotes();
    if (notes[id]) {
      notes[id].title = titleText;
      notes[id].text = noteText;
      setNotesToLocalStorage(notes);
      loadNotes(notes);
    } else {
      console.error("Note not found with ID:", id);
    }
  }

  function saveToLocalStorage(note) {
    const notes = getNotes();
    const uniqId = Math.floor(Date.now() / 1000);
    note.id = uniqId;
    notes[uniqId] = note;
    setNotesToLocalStorage(notes);
    history.pushState(null, null, `?id=${note.id}`);
    loadNotes(notes);
  }

  function SaveNote() {
    if (!title || !noteEditor) return;
    const titleText = title.value.trim();
    const noteText = noteEditor.innerHTML.trim();
    if (titleText === "" && noteText === "") {
      return;
    }
    if (editNoteId) {
      saveNoteById(editNoteId, titleText, noteText);
    } else {
      const note = { title: titleText, text: noteText };
      saveToLocalStorage(note);
    }
    title.value = "";
    noteEditor.innerHTML = "";
    if (window.innerWidth < 1365) {
      containerCreateNote.style.display = "none";
      notesContainer.style.display = "block";
    }
  }

  if (addNote) {
    addNote.addEventListener("click", (event) => {
      event.preventDefault();
      if (title.value.trim() !== "" || noteEditor.innerHTML.trim() !== "") {
      }
      history.pushState(null, null, window.location.pathname);
      editNoteId = null;
      title.value = "";
      noteEditor.value = "";
      if (window.innerWidth < 1365) {
        containerCreateNote.style.display = "block";
        notesContainer.style.display = "none";
      }
    });
  }

  if (saveNote) {
    saveNote.addEventListener("click", (event) => {
      event.preventDefault();
      SaveNote();
    });
  }

  loadNotes(getNotes());

  const firstNote = document.querySelector(".notes_list li");
  if (firstNote) {
    firstNote.click();
  }
});
