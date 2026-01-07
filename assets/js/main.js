document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();
  renderBooks(pageBooks);

  // prevent header overlap
  document.body.style.paddingTop = "64px";
});

/* ================= LOGIN STATE ================= */
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

/* ================= HEADER (FIXED ALWAYS) ================= */
function loadHeader() {
  const userName = isLoggedIn()
    ? (localStorage.getItem("userName") || "User")
    : "അതിഥി";

  document.getElementById("header").innerHTML = `
    <header class="site-header" style="
      position:fixed;
      top:0;
      left:0;
      right:0;
      z-index:10000;
    ">
      <div class="header-left">
        <img src="assets/cover/logo.png" class="site-logo">
        <span class="site-title">THRIPUDI LIBRARY</span>
      </div>

      <div class="header-right">
        <nav class="nav-buttons">
          <a href="index.html" class="nav-btn">Home</a>
          <a href="library.html" class="nav-btn">Library</a>
          <a href="about.html" class="nav-btn">About</a>
          <a href="contact.html" class="nav-btn">Contact</a>
        </nav>

        <div class="user-menu">
          <div class="user-trigger" onclick="toggleUserMenu(event)">
            <img src="assets/cover/default_user.jpg" class="user-avatar">
            <span class="user-name">${userName}</span>
            <span class="caret">▾</span>
          </div>

          <div class="user-dropdown" id="userDropdown">
            <a href="profile.html">Profile</a>
            <a href="history.html">History</a>
            <a href="#" onclick="logout()">Logout</a>
          </div>
        </div>
      </div>
    </header>
  `;
}

function toggleUserMenu(e) {
  e.stopPropagation();
  document.getElementById("userDropdown").classList.toggle("show");
}
document.addEventListener("click", () => {
  const dd = document.getElementById("userDropdown");
  if (dd) dd.classList.remove("show");
});
function logout() {
  localStorage.clear();
  location.href = "login.html";
}

/* ================= FOOTER ================= */
function loadFooter() {
  document.getElementById("footer").innerHTML = `
    <footer class="site-footer">
      © ${new Date().getFullYear()} Thripudi Library
    </footer>
  `;
}

/* ================= BOOK GRID ================= */
function renderBooks(list) {
  const grid = document.getElementById("bookGrid");
  grid.innerHTML = "";

  list.forEach(book => {
    let label = "വായിക്കാം";
    if (book.type === "audio") label = "കേൾക്കാം";
    if (book.type === "video") label = "കാണാം";

    grid.insertAdjacentHTML("beforeend", `
      <div class="book-card">
        <div class="thumb-wrap" id="thumb-${book.id}">
          <img src="${book.img}">
          <div class="thumb-overlay">
            <button onclick="openContent('${book.type}','${book.id}','${book.title}')">
              ${label}
            </button>
          </div>
          <div class="audio-player-box" id="player-${book.id}" style="display:none;"></div>
        </div>
        <div class="book-title">${book.title}</div>
      </div>
    `);
  });
}

/* ================= OPEN HANDLER ================= */
function openContent(type, id, title) {
  if (!isLoggedIn()) {
    loginMessage.innerText = "ലോഗിൻ ചെയ്യണം";
    loginModal.classList.add("show");
    return;
  }

  if (type === "audio") openAudio(id);
  if (type === "video") openVideo(id);
  if (type === "pdf") openPdf(id, title);
}

/* ================= AUDIO (UNCHANGED – PERFECT) ================= */
function openAudio(id) {
  document.querySelectorAll(".audio-player-box").forEach(b => {
    b.style.display = "none";
    b.innerHTML = "";
  });

  const box = document.getElementById("player-" + id);
  box.style.display = "flex";
  box.style.position = "absolute";
  box.style.inset = "0";
  box.style.background = "rgba(0,0,0,0.65)";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  box.style.borderRadius = "inherit";

  box.innerHTML = `
    <div style="
      width:40px;height:40px;border-radius:50%;
      overflow:hidden;background:white;position:relative;
    ">
      <iframe
        src="https://drive.google.com/file/d/${id}/preview"
        style="position:absolute;top:-120px;left:-14px;width:300px;height:300px;border:none;">
      </iframe>
    </div>
    <span onclick="closeAudio('${id}')"
      style="color:white;font-size:24px;margin-left:12px;cursor:pointer;">✕</span>
  `;
}
function closeAudio(id) {
  const box = document.getElementById("player-" + id);
  if (box) { box.innerHTML = ""; box.style.display = "none"; }
}

/* ================= PDF MODAL (OK) ================= */
function openPdf(id, title) {
  closeOverlay();

  document.body.insertAdjacentHTML("beforeend", `
    <div id="overlayMask" style="
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.7);
      display:flex;
    ">
      <div style="flex:1;background:white;display:flex;flex-direction:column;">
        <div style="height:56px;background:#0f766e;color:white;display:flex;align-items:center;padding:0 12px;">
          <button onclick="closeOverlay()">⬅</button>
          <div style="flex:1;text-align:center;">
            <img src="assets/cover/logo.png" height="26"> ത്രിപുടി വായനാ മുറി
          </div>
          <div style="font-size:13px;">${title}</div>
        </div>

        <div style="flex:1;position:relative;">
          <iframe
            src="https://drive.google.com/file/d/${id}/preview?rm=minimal"
            style="width:100%;height:100%;border:none;">
          </iframe>

          <!-- BLOCK TOOLBAR -->
          <div style="position:absolute;top:0;left:0;right:0;height:48px;"></div>
        </div>
      </div>
    </div>
  `);
}

/* ================= VIDEO MODAL (POPOUT FULLY BLOCKED) ================= */
function openVideo(id) {
  closeOverlay();

  document.body.insertAdjacentHTML("beforeend", `
    <div id="overlayMask" style="
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.7);
      display:flex;justify-content:center;align-items:center;
    ">
      <div style="
        width:315px;
        height:90vh;
        background:black;
        display:flex;
        flex-direction:column;
      ">
        <div style="height:56px;background:#0f766e;color:white;display:flex;align-items:center;padding:0 12px;">
          <button onclick="closeOverlay()">⬅</button>
          <div style="flex:1;text-align:center;">
            <img src="assets/cover/logo.png" height="26"> ത്രിപുടി വീഡിയോ മുറി
          </div>
        </div>

        <div style="flex:1;position:relative;">
          <!-- VIDEO -->
          <iframe
            src="https://drive.google.com/file/d/${id}/preview"
            style="width:100%;height:100%;border:none;pointer-events:none;"
            allow="autoplay; fullscreen">
          </iframe>

          <!-- INTERACTION LAYER -->
          <div
            onclick="enableVideo(this)"
            style="position:absolute;inset:0;cursor:pointer;">
          </div>

          <!-- BLOCK TOOLBAR -->
          <div style="position:absolute;top:0;left:0;right:0;height:48px;"></div>
        </div>
      </div>
    </div>
  `);
}

function enableVideo(layer) {
  const iframe = layer.previousElementSibling;
  iframe.style.pointerEvents = "auto";
  layer.remove();
}

/* ================= OVERLAY CLOSE ================= */
function closeOverlay() {
  document.getElementById("overlayMask")?.remove();
}

/* ================= LOGIN MODAL ================= */
function closeLoginModal() {
  loginModal.classList.remove("show");
}
function goToLogin() {
  localStorage.setItem("redirectAfterLogin", location.href);
  location.href = "login.html";
}
