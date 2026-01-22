document.addEventListener("DOMContentLoaded", async () => {
  const dashboardButtons = document.querySelectorAll(".dashboard__menu-button");
  const dashboardGrid = document.getElementById("dashboardGrid");

  const data = await getData();
  if (data) {
    dashboardGrid.innerHTML = createAllTimeCardsHTML(data);
  }
  addButtonEventListeners(dashboardButtons, dashboardGrid);
  initializeTimePeriod(dashboardButtons, dashboardGrid, getTimePeriod());
});

/**
 * Initialize Time Period
 * - add css class to grid
 * - select the right button
 * @param {HTMLButtonElement} dashboardButtons - HTML menu buttons
 * @param {HTMLDivElement} dashboardGrid - HTML div grid container
 * @param {string} mode - "daily", "weekly" or "monthly"
 */
function initializeTimePeriod(dashboardButtons, dashboardGrid, mode) {
  dashboardGrid.classList.add(`dashboard__grid--${mode}`);
  dashboardButtons.forEach((button) => {
    if (button.getAttribute("data-mode") === mode)
      button.setAttribute("aria-selected", "true");
  });
}

/**
 * Load data from data.json
 * @returns data
 */
async function getData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      console.error("Oops! Something went wrong.");
      return null;
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

/**
 * Get timePeriod from LocalStorage
 */
function getTimePeriod() {
  let mode = localStorage.getItem("timePeriod") ?? "weekly";
  return mode;
}

/**
 * Set timePeriod to localStorage
 * @param {string} value
 */
function setTimePeriod(value) {
  localStorage.setItem("timePeriod", value);
}

function createAllTimeCardsHTML(dataArray) {
  let allTimeCardsHTML = "";
  dataArray.forEach((data) => {
    allTimeCardsHTML += createTimeCardHTML(data);
  });
  return allTimeCardsHTML;
}


/**
 * Create HTML Code for a time card
 * @param {object} param - {title, timeframes} 
 * @returns HTML
 */
function createTimeCardHTML({ title, timeframes }) {
  const cssClass = title.replaceAll(" ", "-").toLowerCase();
  return `
      <article class="time-card time-card--${cssClass}">
        <div class="time-card__tag">
          <img src="./assets/images/icon-${cssClass}.svg" alt="">
        </div>
        <div class="time-card__info">
          <header class="time-card__header">
            <h2 class="time-card__category">${title}</h2>
            <button class="time-card__options-button" aria-label="Options">
              <img src="./assets/images/icon-ellipsis.svg" alt="">
            </button>
          </header>
          <div class="time-card__time-container">
            <div class="time-card__time">
              <span data-time="daily">${timeframes.daily.current}hrs</span>
              <span data-time="weekly">${timeframes.weekly.current}hrs</span>
              <span data-time="monthly">${timeframes.monthly.current}hrs</span>
            </div>
            <div class="time-card__past-time">
              <span data-time="daily">Yesterday - ${timeframes.daily.previous}hrs</span>
              <span data-time="weekly">Last week - ${timeframes.weekly.previous}hrs</span>
              <span data-time="monthly">Last month - ${timeframes.monthly.previous}hrs</span>
            </div>
          </div>
        </div>
      </article>
  `;
}

/**
 * Adds click event listeners to all dashboard menu buttons.
 *
 * When a button is clicked:
 * 1. Sets `aria-selected="false"` for all buttons.
 * 2. Sets `aria-selected="true"` for the clicked button.
 * 3. Updates the dashboard grid's CSS class to match the selected time mode
 *    (daily, weekly, monthly).
 */
function addButtonEventListeners(dashboardButtons, dashboardGrid) {
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
      setTimePeriod(mode);
    });
  });
}
