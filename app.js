document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");

  loadNotes();

  addNote.addEventListener("click", () => {
    noteEditor.style.display = "block";
    saveNote.style.display = "block";
    addNote.style.display = "none";
  });

  saveNote.addEventListener("click", () => {
    const noteText = noteEditor.value.trim();
    if (noteText !== "") {
      const li = document.createElement("li");
      li.textContent = noteText;
      noteList.appendChild(li);
      noteEditor.value = "";
      noteEditor.style.display = "none";
      saveNote.style.display = "none";
      addNote.style.display = "block";

      saveToLocalStorage(noteText);
    }
  });

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
        li.textContent = note;
        noteList.appendChild(li);
      });
    }
  }
});
