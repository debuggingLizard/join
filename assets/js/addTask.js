function selectPrio(selected) {
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.${selected}`).classList.add("active");
  document.getElementById("selectedPrio").value = selected;
}
selectPrio("medium");
