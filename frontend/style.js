'use strict'

function toggleNav() {
  let nav = document.getElementById("navbarNav");
  if (nav.style.display === "block") {
    nav.style.display = "none";
  } else {
    nav.style.display = "block";
  }
}
