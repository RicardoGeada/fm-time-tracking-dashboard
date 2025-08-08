const dashboardButtons = document.querySelectorAll(".dashboard__menu-button");
const dashboardGrid = document.getElementById("dashboardGrid");

/**
 * Adds click event listeners to all dashboard menu buttons.
 *
 * When a button is clicked:
 * 1. Sets `aria-selected="false"` for all buttons.
 * 2. Sets `aria-selected="true"` for the clicked button.
 * 3. Updates the dashboard grid's CSS class to match the selected time mode
 *    (daily, weekly, monthly).
 */
dashboardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dashboardButtons.forEach((btn) =>
      btn.setAttribute("aria-selected", "false")
    );
    button.setAttribute("aria-selected", "true");
    const mode = button.dataset.mode;
    dashboardGrid.classList.remove(
      "dashboard__grid--daily",
      "dashboard__grid--weekly",
      "dashboard__grid--monthly"
    );
    dashboardGrid.classList.add(`dashboard__grid--${mode}`);
  });
});
