document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();

  if (window.pageBooks) renderBooks(window.pageBooks);

  document.body.style.paddingTop = "64px";
});

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

/* ================= HEADER ================= */
function loadHeader() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const name =
    isLoggedIn() && user.name ? user.name : "User";

  const avatar =
    user.profileImage
      ? user.profileImage + "?v=" + Date.now()
      : "assets/cover/default_user.jpg";

  const h = document.getElementById("header");
  if (!h) return;

  h.innerHTML = `
  <header class="site-header" style="position:fixed;top:0;left:0;right:0;z-index:10000;">
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
          <img src="${avatar}" class="user-avatar"
               onerror="this.src='assets/cover/default_user.jpg'">
          <span class="user-name">${name}</span>
          <span class="caret">▾</span>
        </div>

        <div class="user-dropdown" id="userDropdown">
          <a href="profile.html">Profile</a>
          <a href="history.html">History</a>
          <a href="#" onclick="logout()">Logout</a>
        </div>
      </div>
    </div>
  </header>`;
}

function toggleUserMenu(e) {
  e.stopPropagation();
  document.getElementById("userDropdown")?.classList.toggle("show");
}
document.addEventListener("click", () => {
  document.getElementById("userDropdown")?.classList.remove("show");
});
function logout() {
  localStorage.clear();
  location.href = "login.html";
}

/* ================= FOOTER ================= */
function loadFooter() {
  const f = document.getElementById("footer");
  if (!f) return;
  f.innerHTML = `<footer class="site-footer">© ${new Date().getFullYear()} Thripudi Library</footer>`;
}
