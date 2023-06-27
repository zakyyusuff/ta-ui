const btnLogoutNav = document.getElementById("btnLogoutNav");
const btnLogoutSide = document.getElementById("btnLogoutSide");

btnLogoutNav.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});

btnLogoutSide.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});
