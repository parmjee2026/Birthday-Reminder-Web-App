"use strict";

const STORAGE_KEY = "birthdayReminderWebAppV1";

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
  deferredInstallPrompt: null,
  editingRecord: null,
  loading: false
};

const elements = {};

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  cacheElements();
  bindEvents();
  populateSettingsForm();
  registerServiceWorker();

  if (!isConfigured()) {
    showConnectionBanner(
      "Connect the app from Settings using your Apps Script Web App URL and access key."
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
    "connectionBanner",
    "dashboardView",
    "birthdaysView",
    "yearlyView",
    "settingsView",
    "nextBirthdayName",
    "nextBirthdayMeta",
    "totalCount",
    "todayCount",
    "upcomingCount",
    "upcomingLabel",
    "upcomingList",
    "birthdaySearch",
    "genderFilter",
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
    "toast"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.nav);
    });
  });

  elements.refreshButton.addEventListener(
    "click",
    refreshCurrentView
  );

  elements.addBirthdayButton.addEventListener(
    "click",
    () => openBirthdayDialog()
  );

  elements.birthdaySearch.addEventListener(
    "input",
    renderBirthdayList
  );

  elements.genderFilter.addEventListener(
    "change",
    renderBirthdayList
  );

  elements.loadYearButton.addEventListener(
    "click",
    async () => {
      const year = Number(elements.yearInput.value);

      if (!Number.isInteger(year) || year < 1900 || year > 2200) {
        showToast("Enter a valid year.", true);
        return;
      }

      state.settings.listYear = year;
      saveLocalSettings();

      await loadYearlyBirthdays(year);
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

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      event.preventDefault();
      state.deferredInstallPrompt = event;
      elements.installButton.hidden = false;
    }
  );

  elements.installButton.addEventListener(
    "click",
    installApp
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
  const response = await apiGet("dashboard");
  state.dashboard = response.data;
}

async function loadBirthdays() {
  const response = await apiGet("birthdays");
  state.birthdays = Array.isArray(response.data)
    ? response.data
    : [];
}

async function loadYearlyBirthdays(year) {
  setLoading(true);

  try {
    const response = await apiGet("yearly", { year });
    state.yearly = Array.isArray(response.data)
      ? response.data
      : [];

    renderYearlyList();
    clearConnectionBanner();

  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }
}

async function loadRemoteSettings() {
  const response = await apiGet("settings");
  const remote = response.data || {};

  state.settings.reminderDays =
    Number(remote.reminderDays) || 7;

  state.settings.listYear =
    Number(remote.listYear) ||
    new Date().getFullYear();

  state.settings.defaultWhatsAppMessage =
    remote.defaultWhatsAppMessage ||
    DEFAULT_SETTINGS.defaultWhatsAppMessage;

  saveLocalSettings();
  populateSettingsForm();
}

function renderDashboard() {
  const data = state.dashboard || {
    total: 0,
    today: 0,
    upcoming: 0,
    reminderDays: state.settings.reminderDays,
    nextBirthday: null,
    upcomingBirthdays: []
  };

  elements.totalCount.textContent = data.total || 0;
  elements.todayCount.textContent = data.today || 0;
  elements.upcomingCount.textContent = data.upcoming || 0;

  elements.upcomingLabel.textContent =
    `Next ${data.reminderDays || state.settings.reminderDays} days`;

  if (data.nextBirthday) {
    const record = data.nextBirthday;

    elements.nextBirthdayName.textContent = record.name;
    elements.nextBirthdayMeta.textContent =
      `${formatDate(record.nextBirthday)} · ${daysText(record.daysLeft)}`;
  } else {
    elements.nextBirthdayName.textContent =
      "No birthday available";

    elements.nextBirthdayMeta.textContent =
      "Add a birthday to get started.";
  }

  renderBirthdayCards(
    elements.upcomingList,
    data.upcomingBirthdays || [],
    {
      limit: 8,
      showEdit: true
    }
  );
}

function renderBirthdayList() {
  const query = elements.birthdaySearch.value
    .trim()
    .toLowerCase();

  const gender = elements.genderFilter.value;

  const filtered = state.birthdays.filter((record) => {
    const searchText = [
      record.name,
      record.relation,
      record.mobile,
      record.whatsapp,
      record.email
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !query || searchText.includes(query);

    const matchesGender =
      !gender || record.gender === gender;

    return matchesSearch && matchesGender;
  });

  renderBirthdayCards(
    elements.birthdayList,
    filtered,
    {
      showEdit: true
    }
  );
}

function renderBirthdayCards(container, records, options = {}) {
  const visibleRecords = Number.isInteger(options.limit)
    ? records.slice(0, options.limit)
    : records;

  if (!visibleRecords.length) {
    container.innerHTML =
      '<div class="empty-state">No birthday records found.</div>';
    return;
  }

  container.innerHTML = visibleRecords
    .map((record) => birthdayCardHtml(record, options))
    .join("");

  container
    .querySelectorAll("[data-edit-id]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const record = state.birthdays.find(
          (item) => item.id === button.dataset.editId
        );

        if (record) {
          openBirthdayDialog(record);
        }
      });
    });
}

function birthdayCardHtml(record, options) {
  const initial = escapeHtml(
    String(record.name || "?").charAt(0).toUpperCase()
  );

  const relation = record.relation
    ? ` · ${escapeHtml(record.relation)}`
    : "";

  const gender = record.gender
    ? ` · ${escapeHtml(record.gender)}`
    : "";

  const whatsappLink = buildWhatsAppLink(record);

  return `
    <article class="birthday-card">
      <div class="avatar">${initial}</div>

      <div class="card-copy">
        <h3>${escapeHtml(record.name)}</h3>
        <p>
          ${formatDate(record.nextBirthday)}
          ${gender}
          ${relation}
        </p>
      </div>

      <div class="card-actions">
        <span class="days-chip ${record.daysLeft === 0 ? "today" : ""}">
          ${daysText(record.daysLeft)}
        </span>

        ${
          whatsappLink
            ? `<a
                class="mini-button whatsapp"
                href="${whatsappLink}"
                target="_blank"
                rel="noopener"
                title="Open WhatsApp"
              >WA</a>`
            : ""
        }

        ${
          options.showEdit
            ? `<button
                class="mini-button"
                type="button"
                data-edit-id="${escapeAttribute(record.id)}"
                title="Edit birthday"
              >✎</button>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderYearlyList() {
  const groups = new Map();

  state.yearly.forEach((record) => {
    if (!groups.has(record.month)) {
      groups.set(record.month, []);
    }

    groups.get(record.month).push(record);
  });

  if (!state.yearly.length) {
    elements.yearlyList.innerHTML =
      '<div class="empty-state">No birthday records are available for this year.</div>';
    return;
  }

  elements.yearlyList.innerHTML = Array.from(groups.entries())
    .map(([month, records]) => {
      return `
        <section class="month-group">
          <h2 class="month-title">
            ${escapeHtml(month)}
            <small>(${records.length})</small>
          </h2>

          <div class="month-list card-list">
            ${records
              .map((record) => {
                const whatsappLink = buildWhatsAppLink(record);

                return `
                  <article class="birthday-card">
                    <div class="avatar">
                      ${escapeHtml(
                        String(record.name || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div class="card-copy">
                      <h3>${escapeHtml(record.name)}</h3>
                      <p>
                        ${formatDate(record.date)}
                        · ${escapeHtml(record.day)}
                        ${
                          record.ageTurning !== ""
                            ? ` · Turning ${escapeHtml(record.ageTurning)}`
                            : ""
                        }
                      </p>
                    </div>

                    <div class="card-actions">
                      ${
                        whatsappLink
                          ? `<a
                              class="mini-button whatsapp"
                              href="${whatsappLink}"
                              target="_blank"
                              rel="noopener"
                            >WA</a>`
                          : ""
                      }
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function openBirthdayDialog(record = null) {
  state.editingRecord = record;

  elements.birthdayForm.reset();
  elements.recordIdInput.value = "";

  if (record) {
    elements.dialogTitle.textContent = "Edit birthday";
    elements.recordIdInput.value = record.id || "";
    elements.nameInput.value = record.name || "";
    elements.genderInput.value = record.gender || "";
    elements.dobInput.value = record.dob || "";
    elements.mobileInput.value = record.mobile || "";
    elements.whatsappInput.value = record.whatsapp || "";
    elements.relationInput.value = record.relation || "";
    elements.emailInput.value = record.email || "";
    elements.notesInput.value = record.notes || "";

    elements.deleteBirthdayButton.hidden =
      record.source === "calendar";

    if (record.source === "calendar") {
      elements.deleteBirthdayButton.title =
        "Calendar birthdays must be deleted from Google Calendar.";
    }
  } else {
    elements.dialogTitle.textContent = "Add birthday";
    elements.deleteBirthdayButton.hidden = true;
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
    showToast("Configure the API first.", true);
    return;
  }

  const id = elements.recordIdInput.value.trim();

  const data = {
    id,
    name: elements.nameInput.value.trim(),
    gender: elements.genderInput.value,
    dob: elements.dobInput.value,
    mobile: elements.mobileInput.value.trim(),
    whatsapp: elements.whatsappInput.value.trim(),
    relation: elements.relationInput.value.trim(),
    email: elements.emailInput.value.trim(),
    notes: elements.notesInput.value.trim()
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

    await Promise.all([
      loadBirthdays(),
      loadDashboard()
    ]);

    renderBirthdayList();
    renderDashboard();

    if (state.activeView === "yearly") {
      await loadYearlyBirthdays(
        Number(elements.yearInput.value) ||
        state.settings.listYear
      );
    }

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
  const record = state.editingRecord;

  if (!record) {
    return;
  }

  if (
    !window.confirm(
      `Delete ${record.name}'s birthday record?`
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
    await apiPost("deleteBirthday", {
      id: record.id
    });

    closeBirthdayDialog();
    showToast("Birthday deleted.");

    await Promise.all([
      loadBirthdays(),
      loadDashboard()
    ]);

    renderBirthdayList();
    renderDashboard();

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

async function saveSettings(event) {
  event.preventDefault();

  const apiUrl = normalizeApiUrl(
    elements.apiUrlInput.value
  );

  const apiKey = elements.apiKeyInput.value.trim();

  const reminderDays = Number(
    elements.reminderDaysInput.value
  );

  const listYear = Number(
    elements.settingsYearInput.value
  );

  const countryCode = elements.countryCodeInput.value
    .replace(/\D/g, "");

  const message = elements.whatsappMessageInput.value.trim();

  if (!apiUrl || !apiKey) {
    showToast(
      "Apps Script URL and access key are required.",
      true
    );
    return;
  }

  state.settings = {
    ...state.settings,
    apiUrl,
    apiKey,
    reminderDays,
    listYear,
    countryCode,
    defaultWhatsAppMessage: message
  };

  saveLocalSettings();

  setButtonLoading(
    elements.settingsForm.querySelector(
      'button[type="submit"]'
    ),
    true,
    "Saving..."
  );

  try {
    await apiPost("saveSettings", {
      reminderDays,
      listYear,
      defaultWhatsAppMessage: message
    });

    showToast("Settings saved.");
    clearConnectionBanner();

    await loadInitialData();
    navigateTo("dashboard");

  } catch (error) {
    handleApiError(error);
  } finally {
    setButtonLoading(
      elements.settingsForm.querySelector(
        'button[type="submit"]'
      ),
      false,
      "Save settings"
    );
  }
}

async function testConnection() {
  const draftUrl = normalizeApiUrl(
    elements.apiUrlInput.value
  );

  const draftKey = elements.apiKeyInput.value.trim();

  if (!draftUrl || !draftKey) {
    showToast(
      "Enter the Apps Script URL and access key.",
      true
    );
    return;
  }

  const previous = { ...state.settings };

  state.settings.apiUrl = draftUrl;
  state.settings.apiKey = draftKey;

  setButtonLoading(
    elements.testConnectionButton,
    true,
    "Testing..."
  );

  try {
    const response = await apiGet("dashboard");

    showToast(
      `Connected successfully. ${response.data.total} birthday record(s) found.`
    );
  } catch (error) {
    state.settings = previous;
    handleApiError(error);
  } finally {
    setButtonLoading(
      elements.testConnectionButton,
      false,
      "Test connection"
    );
  }
}

async function refreshCurrentView() {
  if (!isConfigured()) {
    navigateTo("settings");
    showToast("Configure the API first.", true);
    return;
  }

  setLoading(true);

  try {
    if (state.activeView === "dashboard") {
      await Promise.all([
        loadDashboard(),
        loadBirthdays()
      ]);

      renderDashboard();
      renderBirthdayList();

    } else if (state.activeView === "birthdays") {
      await loadBirthdays();
      renderBirthdayList();

    } else if (state.activeView === "yearly") {
      await loadYearlyBirthdays(
        Number(elements.yearInput.value) ||
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

  document.querySelectorAll(".view").forEach((section) => {
    section.classList.remove("is-active");
  });

  document
    .getElementById(`${view}View`)
    .classList.add("is-active");

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.nav === view
    );
  });

  const titleMap = {
    dashboard: "Dashboard",
    birthdays: "All Birthdays",
    yearly: "Yearly List",
    settings: "Settings"
  };

  elements.pageTitle.textContent = titleMap[view];

  elements.addBirthdayButton.hidden =
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
    state.settings.defaultWhatsAppMessage;
}

async function apiGet(action, params = {}) {
  const url = new URL(state.settings.apiUrl);

  url.searchParams.set("action", action);
  url.searchParams.set("key", state.settings.apiKey);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    redirect: "follow",
    cache: "no-store"
  });

  return parseApiResponse(response);
}

async function apiPost(action, data = {}) {
  const response = await fetch(
    state.settings.apiUrl,
    {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action,
        key: state.settings.apiKey,
        data
      })
    }
  );

  return parseApiResponse(response);
}

async function parseApiResponse(response) {
  const text = await response.text();

  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    throw new Error(
      "The Apps Script response was not valid JSON. " +
      "Check the Web App deployment URL and redeploy the latest version."
    );
  }

  if (!response.ok || !payload.success) {
    throw new Error(
      payload.error ||
      `Request failed with status ${response.status}.`
    );
  }

  return payload;
}

function buildWhatsAppLink(record) {
  const rawNumber =
    record.whatsapp ||
    record.mobile ||
    "";

  let number = String(rawNumber)
    .replace(/\D/g, "");

  if (!number) {
    return "";
  }

  const countryCode =
    String(state.settings.countryCode || "91")
      .replace(/\D/g, "");

  if (
    number.length === 10 &&
    countryCode
  ) {
    number = countryCode + number;
  } else if (
    number.length === 11 &&
    number.startsWith("0") &&
    countryCode
  ) {
    number = countryCode + number.slice(1);
  }

  const message = String(
    state.settings.defaultWhatsAppMessage ||
    DEFAULT_SETTINGS.defaultWhatsAppMessage
  )
    .replaceAll(
      "{name}",
      record.name || ""
    )
    .replaceAll(
      "{date}",
      formatDate(
        record.nextBirthday ||
        record.date
      )
    );

  return (
    `https://wa.me/${number}` +
    `?text=${encodeURIComponent(message)}`
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
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

function daysText(days) {
  const value = Number(days);

  if (value === 0) {
    return "Today";
  }

  return `${value} day${value === 1 ? "" : "s"}`;
}

function loadLocalSettings() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    return {
      ...DEFAULT_SETTINGS,
      ...stored
    };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveLocalSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state.settings)
  );
}

function isConfigured() {
  return Boolean(
    state.settings.apiUrl &&
    state.settings.apiKey
  );
}

function normalizeApiUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);

    if (!url.pathname.endsWith("/exec")) {
      return trimmed.replace(/\/+$/, "");
    }

    return url.toString().replace(/\/$/, "");
  } catch (error) {
    return "";
  }
}

function setLoading(loading) {
  state.loading = loading;
  elements.refreshButton.disabled = loading;

  if (loading) {
    elements.refreshButton.textContent = "…";
  } else {
    elements.refreshButton.textContent = "↻";
  }
}

function setButtonLoading(button, loading, label) {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = label;
}

function showConnectionBanner(message) {
  elements.connectionBanner.hidden = false;
  elements.connectionBanner.textContent = message;
}

function clearConnectionBanner() {
  elements.connectionBanner.hidden = true;
  elements.connectionBanner.textContent = "";
}

function handleApiError(error) {
  const message =
    error && error.message
      ? error.message
      : "Something went wrong.";

  showToast(message, true);
  showConnectionBanner(message);

  if (
    /access key|not configured|deployment|URL/i.test(message)
  ) {
    navigateTo("settings");
  }
}

let toastTimer;

function showToast(message, isError = false) {
  clearTimeout(toastTimer);

  elements.toast.textContent = message;
  elements.toast.style.background =
    isError ? "#b3261e" : "#202124";

  elements.toast.classList.add("is-visible");

  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3400);
}

async function installApp() {
  if (!state.deferredInstallPrompt) {
    return;
  }

  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;

  state.deferredInstallPrompt = null;
  elements.installButton.hidden = true;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .catch(() => {
          // App remains usable without offline cache.
        });
    });
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
