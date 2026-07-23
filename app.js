"use strict";

const STORAGE_KEY =
  "birthdayReminderWebAppV1";

const DEFAULT_SETTINGS = {
  apiUrl: "",
  apiKey: "",
  reminderDays: 7,
  listYear: new Date().getFullYear(),
  countryCode: "91",
  defaultWhatsAppMessage:
    "🎉 Happy Birthday, {name}! Wishing you happiness, good health and success."
};

const state = {
  settings: loadLocalSettings(),
  dashboard: null,
  birthdays: [],
  yearly: [],
  activeView: "dashboard",
  activeFilter: "all",
  deferredInstallPrompt: null,
  editingRecord: null,
  wishRecord: null,
  wishYear: new Date().getFullYear(),
  loading: false
};

const elements = {};

document.addEventListener(
  "DOMContentLoaded",
  initApp
);


async function initApp() {
  cacheElements();
  bindEvents();
  populateSettingsForm();
  registerServiceWorker();

  if (!isConfigured()) {
    showConnectionBanner(
      "Connect the app from Settings using your Apps Script Web App URL and private access key."
    );

    navigateTo("settings");
    return;
  }

  await loadInitialData();
}


function cacheElements() {
  [
    "pageTitle",
    "installButton",
    "refreshButton",
    "topAddBirthdayButton",
    "dashboardAddButton",
    "connectionBanner",
    "dashboardView",
    "birthdaysView",
    "yearlyView",
    "settingsView",
    "totalCount",
    "todayCount",
    "upcomingCount",
    "upcomingLabel",
    "thisMonthCount",
    "nextBirthdayDays",
    "nextBirthdayCard",
    "upcomingTableBody",
    "monthChart",
    "todayBirthdayList",
    "missedBadge",
    "birthdaySearch",
    "genderFilter",
    "wishStatusFilter",
    "resultCount",
    "birthdayList",
    "yearInput",
    "loadYearButton",
    "yearlyList",
    "settingsForm",
    "apiUrlInput",
    "apiKeyInput",
    "reminderDaysInput",
    "settingsYearInput",
    "countryCodeInput",
    "whatsappMessageInput",
    "testConnectionButton",
    "addBirthdayButton",
    "birthdayDialog",
    "birthdayForm",
    "dialogTitle",
    "closeDialogButton",
    "cancelBirthdayButton",
    "deleteBirthdayButton",
    "saveBirthdayButton",
    "recordIdInput",
    "nameInput",
    "genderInput",
    "dobInput",
    "mobileInput",
    "whatsappInput",
    "relationInput",
    "emailInput",
    "notesInput",
    "wishDialog",
    "wishForm",
    "wishPersonName",
    "wishPersonMeta",
    "closeWishDialogButton",
    "wishRecordId",
    "wishNumberInput",
    "wishMessageInput",
    "wishCurrentStatus",
    "copyWishButton",
    "skipWishButton",
    "openWhatsAppButton",
    "markSentButton",
    "toast"
  ].forEach(function (id) {
    elements[id] =
      document.getElementById(id);
  });
}


function bindEvents() {
  document
    .querySelectorAll("[data-nav]")
    .forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          navigateTo(
            button.dataset.nav
          );
        }
      );
    });

  elements.refreshButton.addEventListener(
    "click",
    refreshCurrentView
  );

  [
    elements.addBirthdayButton,
    elements.topAddBirthdayButton,
    elements.dashboardAddButton
  ].forEach(function (button) {
    button.addEventListener(
      "click",
      function () {
        openBirthdayDialog();
      }
    );
  });

  elements.birthdaySearch.addEventListener(
    "input",
    renderBirthdayList
  );

  elements.genderFilter.addEventListener(
    "change",
    renderBirthdayList
  );

  elements.wishStatusFilter.addEventListener(
    "change",
    renderBirthdayList
  );

  document
    .querySelectorAll("[data-filter]")
    .forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          state.activeFilter =
            button.dataset.filter;

          document
            .querySelectorAll(
              "[data-filter]"
            )
            .forEach(function (item) {
              item.classList.toggle(
                "is-active",
                item === button
              );
            });

          renderBirthdayList();
        }
      );
    });

  elements.loadYearButton.addEventListener(
    "click",
    function () {
      const year = Number(
        elements.yearInput.value
      );

      if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2200
      ) {
        showToast(
          "Enter a valid year.",
          true
        );
        return;
      }

      state.settings.listYear = year;
      saveLocalSettings();
      loadYearlyBirthdays(year);
    }
  );

  elements.settingsForm.addEventListener(
    "submit",
    saveSettings
  );

  elements.testConnectionButton.addEventListener(
    "click",
    testConnection
  );

  elements.birthdayForm.addEventListener(
    "submit",
    saveBirthday
  );

  elements.closeDialogButton.addEventListener(
    "click",
    closeBirthdayDialog
  );

  elements.cancelBirthdayButton.addEventListener(
    "click",
    closeBirthdayDialog
  );

  elements.deleteBirthdayButton.addEventListener(
    "click",
    deleteBirthday
  );

  elements.closeWishDialogButton.addEventListener(
    "click",
    closeWishDialog
  );

  elements.copyWishButton.addEventListener(
    "click",
    copyWishMessage
  );

  elements.openWhatsAppButton.addEventListener(
    "click",
    openWhatsAppMessage
  );

  elements.markSentButton.addEventListener(
    "click",
    function () {
      markWishStatus(
        "Sent",
        "WhatsApp"
      );
    }
  );

  elements.skipWishButton.addEventListener(
    "click",
    function () {
      markWishStatus(
        "Skipped",
        "Manual"
      );
    }
  );

  document.addEventListener(
    "click",
    handleActionClick
  );

  window.addEventListener(
    "beforeinstallprompt",
    function (event) {
      event.preventDefault();
      state.deferredInstallPrompt =
        event;

      elements.installButton.hidden =
        false;
    }
  );

  elements.installButton.addEventListener(
    "click",
    installApp
  );
}


function handleActionClick(event) {
  const trigger = event.target.closest(
    "[data-action]"
  );

  if (!trigger) {
    return;
  }

  const id = trigger.dataset.id;
  const action =
    trigger.dataset.action;

  const record = findRecordById(id);

  if (!record) {
    return;
  }

  if (action === "edit") {
    openBirthdayDialog(record);
  }

  if (action === "wish") {
    openWishDialog(record);
  }
}


function findRecordById(id) {
  return (
    state.birthdays.find(
      function (record) {
        return record.id === id;
      }
    ) ||
    state.yearly.find(
      function (record) {
        return record.id === id;
      }
    ) ||
    null
  );
}


async function loadInitialData() {
  setLoading(true);

  try {
    await Promise.all([
      loadDashboard(),
      loadBirthdays(),
      loadRemoteSettings()
    ]);

    renderDashboard();
    renderBirthdayList();
    clearConnectionBanner();

  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
}


async function loadDashboard() {
  const response =
    await apiGet("dashboard");

  state.dashboard =
    response.data || null;
}


async function loadBirthdays() {
  const response =
    await apiGet("birthdays");

  state.birthdays =
    Array.isArray(response.data)
      ? response.data
      : [];
}


async function loadYearlyBirthdays(year) {
  setLoading(true);

  try {
    const response = await apiGet(
      "yearly",
      { year: year }
    );

    state.yearly =
      Array.isArray(response.data)
        ? response.data
        : [];

    state.wishYear = Number(year);
    renderYearlyList();
    clearConnectionBanner();

  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
}


async function loadRemoteSettings() {
  const response =
    await apiGet("settings");

  const remote =
    response.data || {};

  state.settings.reminderDays =
    Number(remote.reminderDays) || 7;

  state.settings.listYear =
    Number(remote.listYear) ||
    new Date().getFullYear();

  state.settings.defaultWhatsAppMessage =
    remote.defaultWhatsAppMessage ||
    DEFAULT_SETTINGS
      .defaultWhatsAppMessage;

  saveLocalSettings();
  populateSettingsForm();
}


function renderDashboard() {
  const data = state.dashboard || {
    total: 0,
    today: 0,
    upcoming: 0,
    thisMonth: 0,
    missed: 0,
    reminderDays:
      state.settings.reminderDays,
    nextBirthday: null,
    upcomingBirthdays: [],
    todayBirthdays: [],
    monthCounts: []
  };

  elements.totalCount.textContent =
    data.total || 0;

  elements.todayCount.textContent =
    data.today || 0;

  elements.upcomingCount.textContent =
    data.upcoming || 0;

  elements.thisMonthCount.textContent =
    data.thisMonth || 0;

  elements.upcomingLabel.textContent =
    "Next " +
    (
      data.reminderDays ||
      state.settings.reminderDays
    ) +
    " Days";

  elements.missedBadge.textContent =
    (data.missed || 0) +
    " missed";

  renderNextBirthday(
    data.nextBirthday
  );

  renderDashboardTable(
    data.upcomingBirthdays || []
  );

  renderTodayList(
    data.todayBirthdays || []
  );

  renderMonthChart(
    data.monthCounts || []
  );
}


function renderNextBirthday(record) {
  if (!record) {
    elements.nextBirthdayDays.textContent =
      "—";

    elements.nextBirthdayCard.innerHTML =
      '<div class="empty-state">No birthday records are available.</div>';

    return;
  }

  elements.nextBirthdayDays.textContent =
    daysText(record.daysLeft);

  const ageText =
    record.age !== ""
      ? "Age " + record.age
      : "Age not available";

  const relation =
    record.relation ||
    "Relation not specified";

  elements.nextBirthdayCard.innerHTML = `
    <div class="next-person-content">
      <div class="large-avatar">
        ${initial(record.name)}
      </div>

      <div>
        <h3>${escapeHtml(record.name)}</h3>
        <p class="meta-line">
          ${formatDate(record.nextBirthday)}
          · ${escapeHtml(record.day || "")}
        </p>
        <p class="meta-line">
          ${escapeHtml(relation)}
          · ${escapeHtml(ageText)}
          · ${wishStatusText(record)}
        </p>
      </div>

      <div class="quick-actions">
        <button
          class="secondary-button"
          type="button"
          data-action="edit"
          data-id="${escapeAttribute(record.id)}"
        >Edit</button>

        <button
          class="primary-button whatsapp-button"
          type="button"
          data-action="wish"
          data-id="${escapeAttribute(record.id)}"
        >Create Wish</button>
      </div>
    </div>
  `;
}


function renderDashboardTable(records) {
  if (!records.length) {
    elements.upcomingTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            No upcoming birthdays.
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.upcomingTableBody.innerHTML =
    records
      .slice(0, 10)
      .map(function (record) {
        return `
          <tr>
            <td>
              <div class="table-person">
                <span class="mini-avatar">
                  ${initial(record.name)}
                </span>
                <strong>
                  ${escapeHtml(record.name)}
                </strong>
              </div>
            </td>
            <td>${formatDate(record.nextBirthday)}</td>
            <td>${daysText(record.daysLeft)}</td>
            <td>${escapeHtml(record.relation || "—")}</td>
            <td>${wishBadgeHtml(record)}</td>
            <td>
              <button
                class="action-icon"
                type="button"
                data-action="wish"
                data-id="${escapeAttribute(record.id)}"
                title="Generate WhatsApp wish"
              >✦</button>
            </td>
          </tr>
        `;
      })
      .join("");
}


function renderTodayList(records) {
  if (!records.length) {
    elements.todayBirthdayList.innerHTML =
      '<div class="empty-state">No birthdays today.</div>';
    return;
  }

  elements.todayBirthdayList.innerHTML =
    records
      .slice(0, 8)
      .map(function (record) {
        return `
          <article class="compact-person">
            <span class="mini-avatar">
              ${initial(record.name)}
            </span>
            <div>
              <h3>${escapeHtml(record.name)}</h3>
              <p>
                ${escapeHtml(record.relation || "No relation")}
                · ${wishStatusText(record)}
              </p>
            </div>
            <button
              class="action-icon"
              type="button"
              data-action="wish"
              data-id="${escapeAttribute(record.id)}"
              title="Generate wish"
            >✦</button>
          </article>
        `;
      })
      .join("");
}


function renderMonthChart(monthCounts) {
  if (!monthCounts.length) {
    elements.monthChart.innerHTML =
      '<div class="empty-state">No chart data.</div>';
    return;
  }

  const maximum = Math.max(
    1,
    ...monthCounts.map(
      function (item) {
        return Number(item.count) || 0;
      }
    )
  );

  elements.monthChart.innerHTML =
    monthCounts
      .map(function (item) {
        const height = Math.max(
          5,
          Math.round(
            ((Number(item.count) || 0) /
              maximum) *
              100
          )
        );

        return `
          <div class="chart-column">
            <div class="chart-track">
              <div
                class="chart-bar"
                style="height:${height}%"
                title="${escapeAttribute(item.label)}: ${item.count}"
              ></div>
            </div>
            <strong class="chart-count">
              ${Number(item.count) || 0}
            </strong>
            <span class="chart-label">
              ${escapeHtml(item.month)}
            </span>
          </div>
        `;
      })
      .join("");
}


function renderBirthdayList() {
  const query =
    elements.birthdaySearch.value
      .trim()
      .toLowerCase();

  const gender =
    elements.genderFilter.value;

  const wishStatus =
    elements.wishStatusFilter.value;

  const filtered =
    state.birthdays.filter(
      function (record) {
        return (
          matchesSearch(record, query) &&
          matchesGender(record, gender) &&
          matchesWishStatus(
            record,
            wishStatus
          ) &&
          matchesTimeFilter(
            record,
            state.activeFilter
          )
        );
      }
    );

  elements.resultCount.textContent =
    filtered.length +
    " record" +
    (filtered.length === 1 ? "" : "s");

  if (!filtered.length) {
    elements.birthdayList.innerHTML =
      '<div class="empty-state">No birthday records match these filters.</div>';
    return;
  }

  elements.birthdayList.innerHTML =
    filtered
      .map(birthdayCardHtml)
      .join("");
}


function matchesSearch(record, query) {
  if (!query) {
    return true;
  }

  const monthName =
    record.monthName ||
    monthNameFromDate(
      record.birthdayThisYear ||
      record.nextBirthday ||
      record.dob
    );

  const text = [
    record.name,
    record.relation,
    record.mobile,
    record.whatsapp,
    record.email,
    record.gender,
    monthName,
    record.day,
    record.wishStatus
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query);
}


function matchesGender(record, gender) {
  return (
    !gender ||
    record.gender === gender
  );
}


function matchesWishStatus(
  record,
  wishStatus
) {
  return (
    !wishStatus ||
    record.wishStatus === wishStatus
  );
}


function matchesTimeFilter(
  record,
  filter
) {
  if (filter === "all") {
    return true;
  }

  const today = startOfToday();

  const thisYearDate =
    parseIsoDate(
      record.birthdayThisYear
    );

  const nextDate =
    parseIsoDate(
      record.nextBirthday
    );

  if (filter === "today") {
    return (
      thisYearDate &&
      sameDay(thisYearDate, today)
    );
  }

  if (filter === "upcoming") {
    return (
      Number(record.daysLeft) > 0 &&
      Number(record.daysLeft) <=
        Number(
          state.settings.reminderDays
        )
    );
  }

  if (filter === "thisMonth") {
    return (
      thisYearDate &&
      thisYearDate.getMonth() ===
        today.getMonth()
    );
  }

  if (filter === "nextMonth") {
    const nextMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    return (
      nextDate &&
      nextDate.getFullYear() ===
        nextMonthDate.getFullYear() &&
      nextDate.getMonth() ===
        nextMonthDate.getMonth()
    );
  }

  if (filter === "missed") {
    return record.missed === true;
  }

  return true;
}


function birthdayCardHtml(record) {
  const relation =
    record.relation || "No relation";

  const contact =
    record.whatsapp ||
    record.mobile ||
    "No number";

  return `
    <article class="birthday-card">
      <div class="avatar">
        ${initial(record.name)}
      </div>

      <div class="card-main">
        <div class="card-heading">
          <h3>${escapeHtml(record.name)}</h3>
          ${wishBadgeHtml(record)}
        </div>

        <p class="card-meta">
          ${formatDate(record.nextBirthday)}
          · ${escapeHtml(record.day || "")}
          · ${daysText(record.daysLeft)}
        </p>

        <p class="card-meta">
          ${escapeHtml(relation)}
          · ${escapeHtml(record.gender || "Gender not specified")}
          · ${escapeHtml(contact)}
        </p>
      </div>

      <div class="card-footer">
        <span class="days-badge ${record.daysLeft === 0 ? "today" : ""}">
          ${daysText(record.daysLeft)}
        </span>

        <span class="spacer"></span>

        <button
          class="small-button"
          type="button"
          data-action="edit"
          data-id="${escapeAttribute(record.id)}"
        >Edit</button>

        <button
          class="small-button message"
          type="button"
          data-action="wish"
          data-id="${escapeAttribute(record.id)}"
        >WhatsApp Wish</button>
      </div>
    </article>
  `;
}


function wishBadgeHtml(record) {
  const status =
    record.missed
      ? "Missed"
      : record.wishStatus ||
        "Pending";

  return `
    <span class="wish-badge ${status.toLowerCase()}">
      ${escapeHtml(status)}
    </span>
  `;
}


function wishStatusText(record) {
  return record.missed
    ? "Wish missed"
    : "Wish " +
      (
        record.wishStatus ||
        "Pending"
      ).toLowerCase();
}


function renderYearlyList() {
  const groups = new Map();

  state.yearly.forEach(
    function (record) {
      if (!groups.has(record.month)) {
        groups.set(
          record.month,
          []
        );
      }

      groups
        .get(record.month)
        .push(record);
    }
  );

  if (!state.yearly.length) {
    elements.yearlyList.innerHTML =
      '<div class="empty-state">No birthday records are available for this year.</div>';
    return;
  }

  elements.yearlyList.innerHTML =
    Array.from(groups.entries())
      .map(function (entry) {
        const month = entry[0];
        const records = entry[1];

        return `
          <section class="month-group">
            <h2 class="month-title">
              <span>${escapeHtml(month)}</span>
              <small>${records.length} birthdays</small>
            </h2>

            <div class="month-list">
              ${records
                .map(yearlyCardHtml)
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
}


function yearlyCardHtml(record) {
  return `
    <article class="birthday-card">
      <div class="avatar">
        ${initial(record.name)}
      </div>

      <div class="card-main">
        <div class="card-heading">
          <h3>${escapeHtml(record.name)}</h3>
          ${wishBadgeHtml(record)}
        </div>

        <p class="card-meta">
          ${formatDate(record.date)}
          · ${escapeHtml(record.day || "")}
          ${
            record.ageTurning !== ""
              ? " · Turning " +
                escapeHtml(
                  record.ageTurning
                )
              : ""
          }
        </p>

        <p class="card-meta">
          ${escapeHtml(record.relation || "No relation")}
          · ${escapeHtml(record.gender || "Gender not specified")}
        </p>
      </div>

      <div class="card-footer">
        <span class="days-badge">
          ${escapeHtml(record.month || "")}
        </span>

        <span class="spacer"></span>

        <button
          class="small-button message"
          type="button"
          data-action="wish"
          data-id="${escapeAttribute(record.id)}"
        >Create Wish</button>
      </div>
    </article>
  `;
}


function openBirthdayDialog(
  record = null
) {
  state.editingRecord = record;
  elements.birthdayForm.reset();
  elements.recordIdInput.value = "";

  if (record) {
    elements.dialogTitle.textContent =
      "Edit Birthday";

    elements.recordIdInput.value =
      record.id || "";

    elements.nameInput.value =
      record.name || "";

    elements.genderInput.value =
      record.gender || "";

    elements.dobInput.value =
      record.dob || "";

    elements.mobileInput.value =
      record.mobile || "";

    elements.whatsappInput.value =
      record.whatsapp || "";

    elements.relationInput.value =
      record.relation || "";

    elements.emailInput.value =
      record.email || "";

    elements.notesInput.value =
      record.notes || "";

    elements.deleteBirthdayButton.hidden =
      record.source === "calendar";

  } else {
    elements.dialogTitle.textContent =
      "Add Birthday";

    elements.deleteBirthdayButton.hidden =
      true;
  }

  elements.birthdayDialog.showModal();
}


function closeBirthdayDialog() {
  state.editingRecord = null;
  elements.birthdayDialog.close();
}


async function saveBirthday(event) {
  event.preventDefault();

  if (!isConfigured()) {
    showToast(
      "Configure the API first.",
      true
    );
    return;
  }

  const id =
    elements.recordIdInput.value.trim();

  const data = {
    id: id,
    name:
      elements.nameInput.value.trim(),
    gender:
      elements.genderInput.value,
    dob:
      elements.dobInput.value,
    mobile:
      elements.mobileInput.value.trim(),
    whatsapp:
      elements.whatsappInput.value.trim(),
    relation:
      elements.relationInput.value.trim(),
    email:
      elements.emailInput.value.trim(),
    notes:
      elements.notesInput.value.trim()
  };

  const action = id
    ? "updateBirthday"
    : "addBirthday";

  setButtonLoading(
    elements.saveBirthdayButton,
    true,
    "Saving..."
  );

  try {
    await apiPost(action, data);

    closeBirthdayDialog();

    showToast(
      id
        ? "Birthday updated."
        : "Birthday added."
    );

    await reloadBirthdayData();

  } catch (error) {
    handleApiError(error);
  } finally {
    setButtonLoading(
      elements.saveBirthdayButton,
      false,
      "Save"
    );
  }
}


async function deleteBirthday() {
  const record =
    state.editingRecord;

  if (!record) {
    return;
  }

  if (
    !window.confirm(
      "Delete " +
      record.name +
      "'s birthday record?"
    )
  ) {
    return;
  }

  setButtonLoading(
    elements.deleteBirthdayButton,
    true,
    "Deleting..."
  );

  try {
    await apiPost(
      "deleteBirthday",
      { id: record.id }
    );

    closeBirthdayDialog();
    showToast("Birthday deleted.");
    await reloadBirthdayData();

  } catch (error) {
    handleApiError(error);
  } finally {
    setButtonLoading(
      elements.deleteBirthdayButton,
      false,
      "Delete"
    );
  }
}


function openWishDialog(record) {
  state.wishRecord = record;

  state.wishYear =
    state.activeView === "yearly"
      ? Number(
          elements.yearInput.value
        ) ||
        state.settings.listYear
      : new Date().getFullYear();

  const date =
    record.date ||
    record.nextBirthday ||
    record.birthdayThisYear;

  elements.wishRecordId.value =
    record.id || "";

  elements.wishPersonName.textContent =
    record.name || "Birthday Wish";

  elements.wishPersonMeta.textContent =
    formatDate(date) +
    (
      record.relation
        ? " · " + record.relation
        : ""
    );

  elements.wishNumberInput.value =
    record.whatsapp ||
    record.mobile ||
    "";

  elements.wishMessageInput.value =
    buildWishMessage(record);

  setWishStatusBadge(
    record.missed
      ? "Missed"
      : record.wishStatus ||
        "Pending"
  );

  elements.wishDialog.showModal();
}


function closeWishDialog() {
  state.wishRecord = null;
  elements.wishDialog.close();
}


function buildWishMessage(record) {
  const date =
    record.date ||
    record.nextBirthday ||
    record.birthdayThisYear;

  return String(
    state.settings
      .defaultWhatsAppMessage ||
    DEFAULT_SETTINGS
      .defaultWhatsAppMessage
  )
    .replaceAll(
      "{name}",
      record.name || ""
    )
    .replaceAll(
      "{date}",
      formatDate(date)
    )
    .replaceAll(
      "{age}",
      record.ageTurning !== undefined &&
      record.ageTurning !== ""
        ? String(record.ageTurning)
        : record.age !== undefined &&
          record.age !== ""
          ? String(record.age)
          : ""
    )
    .replaceAll(
      "{relation}",
      record.relation || ""
    );
}


async function copyWishMessage() {
  const message =
    elements.wishMessageInput.value;

  try {
    await navigator.clipboard
      .writeText(message);

    showToast("Message copied.");
  } catch (error) {
    elements.wishMessageInput.select();
    document.execCommand("copy");
    showToast("Message copied.");
  }
}


function openWhatsAppMessage() {
  const number =
    normalizeWhatsAppNumber(
      elements.wishNumberInput.value
    );

  if (!number) {
    showToast(
      "Enter a WhatsApp number.",
      true
    );
    return;
  }

  const message =
    elements.wishMessageInput.value.trim();

  const link =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    link,
    "_blank",
    "noopener"
  );
}


async function markWishStatus(
  status,
  channel
) {
  const record =
    state.wishRecord;

  if (!record) {
    return;
  }

  const button =
    status === "Sent"
      ? elements.markSentButton
      : elements.skipWishButton;

  setButtonLoading(
    button,
    true,
    "Saving..."
  );

  try {
    const response = await apiPost(
      "setWishStatus",
      {
        id: record.id,
        year: state.wishYear,
        status: status,
        channel: channel,
        message:
          elements.wishMessageInput.value.trim()
      }
    );

    applyWishStatusLocally(
      record.id,
      response.data
    );

    setWishStatusBadge(status);
    showToast(
      "Wish marked " +
      status.toLowerCase() +
      "."
    );

    await loadDashboard();
    renderDashboard();
    renderBirthdayList();

    if (
      state.activeView === "yearly"
    ) {
      await loadYearlyBirthdays(
        state.wishYear
      );
    }

  } catch (error) {
    handleApiError(error);
  } finally {
    setButtonLoading(
      button,
      false,
      status === "Sent"
        ? "Mark Sent"
        : "Mark Skipped"
    );
  }
}


function applyWishStatusLocally(
  id,
  wish
) {
  [state.birthdays, state.yearly]
    .forEach(function (collection) {
      collection.forEach(
        function (record) {
          if (record.id === id) {
            record.wishStatus =
              wish.status;

            record.wishChannel =
              wish.channel;

            record.wishMessage =
              wish.message;

            record.wishUpdatedAt =
              wish.updatedAt;

            record.missed = false;
          }
        }
      );
    });
}


function setWishStatusBadge(status) {
  const normalized =
    String(status || "Pending");

  elements.wishCurrentStatus
    .className =
      "wish-badge " +
      normalized.toLowerCase();

  elements.wishCurrentStatus
    .textContent = normalized;
}


function normalizeWhatsAppNumber(value) {
  let number =
    String(value || "")
      .replace(/\D/g, "");

  if (!number) {
    return "";
  }

  const countryCode =
    String(
      state.settings.countryCode ||
      "91"
    ).replace(/\D/g, "");

  if (
    number.length === 10 &&
    countryCode
  ) {
    number =
      countryCode + number;

  } else if (
    number.length === 11 &&
    number.startsWith("0") &&
    countryCode
  ) {
    number =
      countryCode +
      number.slice(1);
  }

  return number;
}


async function reloadBirthdayData() {
  await Promise.all([
    loadBirthdays(),
    loadDashboard()
  ]);

  renderBirthdayList();
  renderDashboard();

  if (
    state.activeView === "yearly"
  ) {
    await loadYearlyBirthdays(
      Number(
        elements.yearInput.value
      ) ||
      state.settings.listYear
    );
  }
}


async function saveSettings(event) {
  event.preventDefault();

  const apiUrl =
    normalizeApiUrl(
      elements.apiUrlInput.value
    );

  const apiKey =
    elements.apiKeyInput.value.trim();

  const reminderDays = Number(
    elements.reminderDaysInput.value
  );

  const listYear = Number(
    elements.settingsYearInput.value
  );

  const countryCode =
    elements.countryCodeInput.value
      .replace(/\D/g, "");

  const message =
    elements.whatsappMessageInput.value
      .trim();

  if (!apiUrl || !apiKey) {
    showToast(
      "Apps Script URL and access key are required.",
      true
    );
    return;
  }

  state.settings = {
    ...state.settings,
    apiUrl: apiUrl,
    apiKey: apiKey,
    reminderDays: reminderDays,
    listYear: listYear,
    countryCode: countryCode,
    defaultWhatsAppMessage: message
  };

  saveLocalSettings();

  const saveButton =
    elements.settingsForm
      .querySelector(
        'button[type="submit"]'
      );

  setButtonLoading(
    saveButton,
    true,
    "Saving..."
  );

  try {
    await apiPost(
      "saveSettings",
      {
        reminderDays: reminderDays,
        listYear: listYear,
        defaultWhatsAppMessage:
          message
      }
    );

    showToast("Settings saved.");
    clearConnectionBanner();
    await loadInitialData();
    navigateTo("dashboard");

  } catch (error) {
    handleApiError(error);
  } finally {
    setButtonLoading(
      saveButton,
      false,
      "Save Settings"
    );
  }
}


async function testConnection() {
  const draftUrl =
    normalizeApiUrl(
      elements.apiUrlInput.value
    );

  const draftKey =
    elements.apiKeyInput.value.trim();

  if (!draftUrl || !draftKey) {
    showToast(
      "Enter the Apps Script URL and access key.",
      true
    );
    return;
  }

  const previous = {
    ...state.settings
  };

  state.settings.apiUrl =
    draftUrl;

  state.settings.apiKey =
    draftKey;

  setButtonLoading(
    elements.testConnectionButton,
    true,
    "Testing..."
  );

  try {
    const response =
      await apiGet("dashboard");

    showToast(
      "Connected successfully. " +
      response.data.total +
      " birthday record(s) found."
    );

  } catch (error) {
    state.settings = previous;
    handleApiError(error);
  } finally {
    setButtonLoading(
      elements.testConnectionButton,
      false,
      "Test Connection"
    );
  }
}


async function refreshCurrentView() {
  if (!isConfigured()) {
    navigateTo("settings");

    showToast(
      "Configure the API first.",
      true
    );
    return;
  }

  setLoading(true);

  try {
    if (
      state.activeView ===
      "dashboard"
    ) {
      await Promise.all([
        loadDashboard(),
        loadBirthdays()
      ]);

      renderDashboard();
      renderBirthdayList();

    } else if (
      state.activeView ===
      "birthdays"
    ) {
      await loadBirthdays();
      renderBirthdayList();

    } else if (
      state.activeView ===
      "yearly"
    ) {
      await loadYearlyBirthdays(
        Number(
          elements.yearInput.value
        ) ||
        state.settings.listYear
      );

    } else {
      await loadRemoteSettings();
    }

    showToast("Refreshed.");
    clearConnectionBanner();

  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
}


function navigateTo(view) {
  const validViews = [
    "dashboard",
    "birthdays",
    "yearly",
    "settings"
  ];

  if (!validViews.includes(view)) {
    view = "dashboard";
  }

  state.activeView = view;

  document
    .querySelectorAll(".view")
    .forEach(function (section) {
      section.classList.remove(
        "is-active"
      );
    });

  document
    .getElementById(
      view + "View"
    )
    .classList.add("is-active");

  document
    .querySelectorAll(
      ".nav-link, .mobile-nav"
    )
    .forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.dataset.nav === view
      );
    });

  const titleMap = {
    dashboard: "Dashboard",
    birthdays: "All Birthdays",
    yearly: "Yearly Birthday List",
    settings: "Settings"
  };

  elements.pageTitle.textContent =
    titleMap[view];

  elements.addBirthdayButton.hidden =
    view === "settings";

  elements.topAddBirthdayButton.hidden =
    view === "settings";

  if (
    view === "yearly" &&
    isConfigured() &&
    !state.yearly.length
  ) {
    elements.yearInput.value =
      state.settings.listYear;

    loadYearlyBirthdays(
      state.settings.listYear
    );
  }
}


function populateSettingsForm() {
  elements.apiUrlInput.value =
    state.settings.apiUrl || "";

  elements.apiKeyInput.value =
    state.settings.apiKey || "";

  elements.reminderDaysInput.value =
    state.settings.reminderDays;

  elements.settingsYearInput.value =
    state.settings.listYear;

  elements.yearInput.value =
    state.settings.listYear;

  elements.countryCodeInput.value =
    state.settings.countryCode;

  elements.whatsappMessageInput.value =
    state.settings
      .defaultWhatsAppMessage;
}


async function apiGet(
  action,
  params = {}
) {
  const url = new URL(
    state.settings.apiUrl
  );

  url.searchParams.set(
    "action",
    action
  );

  url.searchParams.set(
    "key",
    state.settings.apiKey
  );

  Object
    .entries(params)
    .forEach(function (entry) {
      url.searchParams.set(
        entry[0],
        String(entry[1])
      );
    });

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    }
  );

  return parseApiResponse(
    response
  );
}


async function apiPost(
  action,
  data = {}
) {
  const response = await fetch(
    state.settings.apiUrl,
    {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: action,
        key: state.settings.apiKey,
        data: data
      })
    }
  );

  return parseApiResponse(
    response
  );
}


async function parseApiResponse(
  response
) {
  const text =
    await response.text();

  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    throw new Error(
      "The Apps Script response was not valid JSON. " +
      "Replace 09_WebAppApi.gs and redeploy a new Web App version."
    );
  }

  if (
    !response.ok ||
    !payload.success
  ) {
    throw new Error(
      payload.error ||
      "Request failed with status " +
      response.status +
      "."
    );
  }

  return payload;
}


function formatDate(value) {
  const date = parseIsoDate(value);

  if (!date) {
    return value || "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}


function monthNameFromDate(value) {
  const date = parseIsoDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    { month: "long" }
  ).format(date);
}


function parseIsoDate(value) {
  const match = String(
    value || ""
  ).match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return null;
  }

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    0,
    0,
    0,
    0
  );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}


function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}


function sameDay(first, second) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}


function daysText(days) {
  const value = Number(days);

  if (value === 0) {
    return "Today";
  }

  return (
    value +
    " day" +
    (value === 1 ? "" : "s")
  );
}


function initial(name) {
  return escapeHtml(
    String(name || "?")
      .charAt(0)
      .toUpperCase()
  );
}


function loadLocalSettings() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) || "{}"
    );

    return {
      ...DEFAULT_SETTINGS,
      ...stored
    };

  } catch (error) {
    return {
      ...DEFAULT_SETTINGS
    };
  }
}


function saveLocalSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      state.settings
    )
  );
}


function isConfigured() {
  return Boolean(
    state.settings.apiUrl &&
    state.settings.apiKey
  );
}


function normalizeApiUrl(value) {
  const trimmed =
    String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url =
      new URL(trimmed);

    return url
      .toString()
      .replace(/\/$/, "");

  } catch (error) {
    return "";
  }
}


function setLoading(loading) {
  state.loading = loading;
  elements.refreshButton.disabled =
    loading;

  elements.refreshButton.textContent =
    loading ? "…" : "↻";
}


function setButtonLoading(
  button,
  loading,
  label
) {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = label;
}


function showConnectionBanner(
  message
) {
  elements.connectionBanner.hidden =
    false;

  elements.connectionBanner.textContent =
    message;
}


function clearConnectionBanner() {
  elements.connectionBanner.hidden =
    true;

  elements.connectionBanner.textContent =
    "";
}


function handleApiError(error) {
  const message =
    error && error.message
      ? error.message
      : "Something went wrong.";

  showToast(message, true);
  showConnectionBanner(message);

  if (
    /access key|not configured|deployment|URL|valid JSON/i
      .test(message)
  ) {
    navigateTo("settings");
  }
}


let toastTimer;


function showToast(
  message,
  isError = false
) {
  clearTimeout(toastTimer);

  elements.toast.textContent =
    message;

  elements.toast.style.background =
    isError
      ? "#b3261e"
      : "#1f2937";

  elements.toast.classList.add(
    "is-visible"
  );

  toastTimer = setTimeout(
    function () {
      elements.toast.classList.remove(
        "is-visible"
      );
    },
    3400
  );
}


async function installApp() {
  if (
    !state.deferredInstallPrompt
  ) {
    return;
  }

  state.deferredInstallPrompt
    .prompt();

  await state.deferredInstallPrompt
    .userChoice;

  state.deferredInstallPrompt =
    null;

  elements.installButton.hidden =
    true;
}


function registerServiceWorker() {
  if (
    "serviceWorker" in navigator
  ) {
    window.addEventListener(
      "load",
      function () {
        navigator.serviceWorker
          .register("sw.js")
          .catch(function () {
            // The app remains usable without offline caching.
          });
      }
    );
  }
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
  return escapeHtml(value);
}
