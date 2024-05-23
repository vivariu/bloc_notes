document.addEventListener("DOMContentLoaded", () => {
  const addNote = document.getElementById("add_note");
  const noteEditor = document.getElementById("note_editor");
  const saveNote = document.getElementById("save_note");
  const noteList = document.getElementById("notes_list");
  const title = document.getElementById("title");

  if (noteList) {
    listNotes();
  }
  // fonction pour que lorsque je click je sois redirigé vers la bonne page dynamiquement.
  function redirection() {
    if (addNote) {
      addNote.addEventListener("click", (event) => {
        event.preventDefault();

        window.location.href = "details.html";
      });
    }
  }
  redirection();

  function listNotes() {
    loadNotes();

    function loadNotes() {
      const notes = localStorage.getItem("notes");
      if (notes) {
        const parsedNotes = JSON.parse(notes);
        noteList.innerHTML = "";
        parsedNotes.forEach((note) => {
          const li = document.createElement("li");
          const deleteButton = createDeleteButton(note.id);
          li.textContent = note.title;
          li.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = `details.html?id=${note.id}`;
          });

          li.appendChild(deleteButton);
          noteList.appendChild(li);
        });
      }
    }

    function createDeleteButton(id) {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
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
        parsedNotes = parsedNotes.filter((note) => note.id != id);
        localStorage.setItem("notes", JSON.stringify(parsedNotes));
        loadNotes();
      }
    }
  }

  function detailsNotes() {
    save();

    function save() {
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
              }
              if (addNote) addNote.style.display = "block";
              window.location.href = "index.html";
              // j'ai du rajouter title et note.value car sinon lorsque je save une note les champs ne se vident pas
              // ca enregistre donc deux notes au lieu d'une
              title.value = "";
              noteEditor.value = "";
            }
          }
        });
      }
    }
    {
      if (window) {
        const url = new URL(location.href);
        const id = url.searchParams.get("id");
        if (id) {
          loadNoteById(id);
        }
      }
    }

    function loadNoteById(id) {
      const notes = localStorage.getItem("notes");
      if (notes) {
        const parsedNotes = JSON.parse(notes);
        const note = parsedNotes.find((note) => note.id == id);
        if (title && noteEditor && note) {
          title.value = note.title;
          noteEditor.value = note.text;
          if (saveNote) saveNote.style.display = "block";
        }
      }
    }

    function saveNoteById(id, titleText, noteText) {
      const notes = localStorage.getItem("notes");
      if (notes) {
        const parsedNotes = JSON.parse(notes);
        const noteIndex = parsedNotes.findIndex((note) => note.id == id);
        parsedNotes[noteIndex].title = titleText;
        parsedNotes[noteIndex].text = noteText;
        localStorage.setItem("notes", JSON.stringify(parsedNotes));
      }
    }

    function saveToLocalStorage(note) {
      let notes = localStorage.getItem("notes");
      notes = notes ? JSON.parse(notes) : [];
      notes.push(note);

      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }

  detailsNotes();
});
