/**
 * Sets the priority (urgent, medium, low), updates the UI, and stores the selection in a hidden field.
 */
function selectPrio(selected) {
  document.querySelectorAll(".prio-btn").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`.prio-btn.${selected}`).classList.add("active");
  document.getElementById("selectedPrio").value = selected;
}
selectPrio("medium");
