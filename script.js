document.addEventListener("DOMContentLoaded", async () => {
  const dashboardButtons = document.querySelectorAll(".dashboard__menu-button");
  const dashboardGrid = document.getElementById("dashboardGrid");

  const data = await getData();
  if (data) {
    dashboardGrid.innerHTML = createAllTimeCardsHTML(data);
  }
  addButtonEventListeners(dashboardButtons, dashboardGrid);
  setMode(getMode(), dashboardButtons, dashboardGrid);
});


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
 * Get Mode from LocalStorage
 * @returns {"daily" | "weekly" | "monthly"}
 */
function getMode() {
  let mode = localStorage.getItem("mode") ?? "weekly";
  return mode;
}

/**
 * Sets the active dashboard mode.
 *
 * - Updates aria-selected on buttons
 * - Updates dashboard grid CSS class
 * - Persists mode in localStorage
 *
 * @param {"daily" | "weekly" | "monthly"} mode
 * @param {NodeListOf<HTMLButtonElement>} dashboardButtons
 * @param {HTMLElement} dashboardGrid
 */
function setMode(mode, dashboardButtons, dashboardGrid) {
  // buttons
  dashboardButtons.forEach(btn => {
    btn.setAttribute(
      "aria-selected",
      btn.dataset.mode === mode ? "true" : "false"
    );
  });

  // grid classes
  dashboardGrid.classList.remove(
    "dashboard__grid--daily",
    "dashboard__grid--weekly",
    "dashboard__grid--monthly"
  );
  dashboardGrid.classList.add(`dashboard__grid--${mode}`);

  // save to localStorage
  localStorage.setItem("mode", mode);
}


/**
 * Creates the HTML string for all time cards.
 * @param {TimeCardData[]} dataArray
 * @returns {string}
 */
function createAllTimeCardsHTML(dataArray) {
  let allTimeCardsHTML = "";
  dataArray.forEach((data) => {
    allTimeCardsHTML += createTimeCardHTML(data);
  });
  return allTimeCardsHTML;
}


/**
 * Creates the HTML for a single time card.
 * @param {TimeCardData} data
 * @returns {string}
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
 * Attaches click handlers to dashboard menu buttons.
 * @param {NodeListOf<HTMLButtonElement>} dashboardButtons
 * @param {HTMLElement} dashboardGrid
 */
function addButtonEventListeners(dashboardButtons, dashboardGrid) {
  dashboardButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode, dashboardButtons, dashboardGrid);
    });
  });
}
