document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");

  addNote.addEventListener("click", () => {
    noteEditor.style.display = "block";
    saveNote.style.display = "block";
  });
});
