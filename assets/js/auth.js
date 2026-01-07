const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const msg = document.getElementById("msg");
const rmsg = document.getElementById("rmsg");

loginBtn.onclick = () => {

  msg.innerText = "Checking login...";
  msg.className = "msg";

  const data = new URLSearchParams();
  data.append("action", "login");
  data.append("email", email.value.trim());
  data.append("password", password.value.trim());

  fetch(API_URL, { method: "POST", body: data })
    .then(r => r.json())
    .then(d => {

      if (d.status !== "ok") {
        msg.classList.add("error");
        msg.innerText = "Invalid login";
        return;
      }

      /* ✅ SINGLE SOURCE OF TRUTH */
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", JSON.stringify(d.user));

      msg.classList.add("success");
      msg.innerText = "Login successful ✔";

      const redirect =
        localStorage.getItem("redirectAfterLogin") || "index.html";
      localStorage.removeItem("redirectAfterLogin");

      setTimeout(() => location.href = redirect, 600);
    })
    .catch(() => {
      msg.classList.add("error");
      msg.innerText = "Server error";
    });
};

registerBtn.onclick = () => {

  rmsg.innerText = "Creating account...";
  rmsg.className = "msg";

  const data = new URLSearchParams();
  data.append("action", "register");
  data.append("name", rname.value.trim());
  data.append("email", remail.value.trim());
  data.append("password", rpassword.value.trim());

  fetch(API_URL, { method: "POST", body: data })
    .then(r => r.json())
    .then(d => {
      if (d.status === "ok") {
        rmsg.classList.add("success");
        rmsg.innerText = "Registration successful ✔ Please login";
      } else {
        rmsg.classList.add("error");
        rmsg.innerText = d.message || "Registration failed";
      }
    });
};
