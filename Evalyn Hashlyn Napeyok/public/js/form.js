const form = document.getElementById("songForm");
const notification = document.getElementById("notification");
const coverInput = document.getElementById("coverInput");
const coverPreview = document.getElementById("coverPreview");
const songsList = document.getElementById("songsList");

// Cover preview
coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];
  coverPreview.innerHTML = "";
  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    coverPreview.appendChild(img);
  } else {
    coverPreview.innerHTML = `<span class="cover-text">Cover Photo</span>`;
  }
});

// Load existing songs
async function loadSongs() {
  try {
    const res = await fetch("/api/songs");
    const songs = await res.json();
    songs.forEach(song => appendUploadedSong(song));
  } catch (err) {
    console.error("Error loading songs", err);
  }
}
window.addEventListener("DOMContentLoaded", loadSongs);

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = form.title.value.trim();
  const artist = form.artist.value.trim();
  const album = form.album.value.trim();
  const year = form.year.value.trim();
  const audio = form.audio.files[0];
  const cover = form.cover.files[0];

  const isTitleValid = validateInput(form.title, title);
  const isArtistValid = validateInput(form.artist, artist);
  const isAudioValid = validateInput(form.audio, audio);
  const isCoverValid = validateInput(form.cover, cover);

  if (!isTitleValid || !isArtistValid || !isAudioValid || !isCoverValid) {
    showNotification("Please fill all required fields and upload files.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("album", album);
  formData.append("year", year);
  formData.append("audio", audio);
  formData.append("cover", cover);

  try {
    const res = await fetch("/api/songs", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      showNotification(data.message, "success");
      form.reset();
      coverPreview.innerHTML = "<span id='coverPlaceholder'>+</span>";
      clearValidationStyles();
      appendUploadedSong(data.song);
    } else {
      showNotification(data.message, "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("Server error. Try again.", "error");
  }
});

// Input validation
function validateInput(input, value) {
  let valid = false;
  if (input.type === "file") {
    if (input.files.length > 0) {
      input.classList.add("input-valid");
      input.classList.remove("input-invalid");
      valid = true;
    } else input.classList.add("input-invalid");
  } else {
    if (value) {
      input.classList.add("input-valid");
      input.classList.remove("input-invalid");
      valid = true;
    } else input.classList.add("input-invalid");
  }
  return valid;
}

function clearValidationStyles() {
  form.querySelectorAll("input").forEach(i => i.classList.remove("input-valid", "input-invalid"));
}

function showNotification(msg, type) {
  notification.textContent = msg;
  notification.className = `notification ${type}`;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 4000);
}

function appendUploadedSong(song) {
  const div = document.createElement("div");
  div.classList.add("song-card");
  div.innerHTML = `
    <img src="${song.coverPath}" class="song-cover" />
    <div class="song-meta">
      <h3>${song.title} - ${song.artist}</h3>
      <p>${song.album ? song.album : ""} ${song.year ? "(" + song.year + ")" : ""}</p>
      <audio controls src="${song.audioPath}"></audio>
    </div>
  `;
  songsList.prepend(div);
}
