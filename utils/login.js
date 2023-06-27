import { postWithToken } from "https://jscroot.github.io/api/croot.js";
const BASE_URL = "https://golang-restoran-i2-app.herokuapp.com";
const TOKEN = localStorage.getItem("token");
const formLogin = document.getElementById("formLogin");
const alert = document.getElementById("alert");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formLogin));
  postWithToken(`${BASE_URL}/users/login`, "token", TOKEN, data, (res) => {
    if (res.error) {
      alert.style.display = "block";
    } else {
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("token", res.token);
      localStorage.setItem("authenticated", true);
      window.location.href = ".";
    }
  });
});
