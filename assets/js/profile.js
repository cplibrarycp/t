const API_URL = "https://script.google.com/macros/s/AKfycbzV3XB2zkOFqPjClJ4Asm6uyLmW_7cQuUiM5h5LJkizrR9JMXLKhxpJTkqYPq_NR-7L/exec";

document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user") || {});
  if (!user.email) {
    location.href = "login.html";
    return;
  }

  /* 🔁 ALWAYS REFRESH FROM SHEET */
  fetch(API_URL + "?action=getProfile&email=" + encodeURIComponent(user.email))
    .then(r => r.json())
    .then(d => {
      if (d.status !== "ok") return;

      /* ✅ overwrite single truth */
      localStorage.setItem("user", JSON.stringify(d.data));

      fillForm(d.data);
      updatePhoto(d.data.profileImage);
      loadHeader();
    });
});

function fillForm(d) {
  name.value = d.name || "";
  age.value = d.age || "";
  gender.value = d.gender || "";
  job.value = d.job || "";
  address.value = d.address || "";
  mobile.value = d.mobile || "";
  whatsapp.value = d.whatsapp || "";
}

function updatePhoto(url) {
  profilePreview.src =
    url ? url + "?v=" + Date.now() : "assets/cover/default_user.jpg";
}

/* ================= PHOTO UPLOAD ================= */
function uploadPhoto() {

  const file = photoInput.files[0];
  if (!file) return alert("Photo select ചെയ്യുക");

  const reader = new FileReader();
  reader.onload = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const data = new URLSearchParams();
    data.append("action", "uploadProfile");
    data.append("email", user.email);
    data.append("image", reader.result);

    fetch(API_URL, { method: "POST", body: data })
      .then(r => r.json())
      .then(d => {
        if (d.status !== "ok") return alert("Upload failed");

        user.profileImage = d.imageUrl;
        localStorage.setItem("user", JSON.stringify(user));

        updatePhoto(d.imageUrl);
        loadHeader();
        photoMsg.innerText = "Photo updated ✔";
      });
  };
  reader.readAsDataURL(file);
}

/* ================= SAVE PROFILE ================= */
function saveProfile() {

  const user = JSON.parse(localStorage.getItem("user"));

  const data = new URLSearchParams();
  data.append("action", "saveProfile");
  data.append("email", user.email);

  ["name","age","gender","job","address","mobile","whatsapp"]
    .forEach(id => data.append(id, document.getElementById(id).value));

  fetch(API_URL, { method: "POST", body: data })
    .then(r => r.json())
    .then(d => {
      if (d.status !== "ok") return alert("Save failed");

      user.name = name.value;
      localStorage.setItem("user", JSON.stringify(user));

      loadHeader();
      profileMsg.innerText = "Profile saved ✔";
    });
}
