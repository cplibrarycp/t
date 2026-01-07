document.addEventListener("DOMContentLoaded", function () {

  const URL = "https://script.google.com/macros/s/AKfycbzZWilk9uhQHFMreBgj5uyOSljytcKWEWyxlD9jrv87GC7ZDg8AySYJJ7cGsWSXfLaF/exec?action=analytics";

  fetch(URL)
    .then(res => res.json())
    .then(data => {

      const tv = document.getElementById("totalViews");
      const au = document.getElementById("activeUsers");

      if (tv) tv.innerText = data.totalViews;
      if (au) au.innerText = data.activeUsers;

    })
    .catch(err => console.error("Analytics Error:", err));

});
