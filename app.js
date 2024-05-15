document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");

  addNote.addEventListener("click", () => {
    noteEditor.style.display = "block";
    saveNote.style.display = "block";
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
    }
  });
});
