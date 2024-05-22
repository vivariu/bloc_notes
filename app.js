document.addEventListener("DOMContentLoaded", () => {
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");

  let allNotes = getNotesFromLocalStorage(); // !!

  if (noteList) {
    loadNotes(allNotes);
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
      const li = createNoteList(notes[id]);
      noteList.appendChild(li);
    }
  }

  function loadNoteById(notes, id) {
    const note = notes[id];
    if (title && noteEditor && note) {
      title.value = note.title;
      noteEditor.value = note.text;
    }
  }

  function saveNoteById(id, titleText, noteText) {
    allNotes[id].title = titleText;
    allNotes[id].text = noteText;
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
    allNotes.push(note);
    setNotesToLocalStorage(allNotes);
  }

  if (saveNote) {
    // crée la fonction
    saveNote.addEventListener("click", () => {
      if (title && noteEditor) {
        const titleText = title.value.trim();
        const noteText = noteEditor.value.trim();
        const id = urlParams.get("id");

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
    });
  }
});
