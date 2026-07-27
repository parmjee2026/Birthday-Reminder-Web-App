// Birthday Reminder v5.3.0 — Dashboard & Quick Actions
// Privacy-first UI enhancement layer. No contact data is sent anywhere new.

(() => {
  if (window.__birthdayReminderV530Loaded) return;
  window.__birthdayReminderV530Loaded = true;

  const BUILD_VERSION = "5.3.0";

  function byId(id) {
    return document.getElementById(id);
  }

  function installV530Styles() {
    if (byId("birthdayV530Styles")) return;

    const style = document.createElement("style");
    style.id = "birthdayV530Styles";
    style.textContent = `
      /* Dashboard date details */
      .v530-date-details {
        display: grid;
        gap: 1px;
        margin-top: 7px;
      }

      .v530-date-details strong {
        color: var(--text);
        font-size: 12px;
        line-height: 1.3;
      }

      .v530-date-details span {
        color: var(--muted);
        font-size: 11px;
        line-height: 1.35;
      }

      /* Next birthday */
      .birthday-focus-card.v530-focus-card {
        border-color: #ffd6b3;
      }

      .birthday-focus-card.v530-focus-card .focus-days-label {
        font-weight: 900;
        color: var(--orange-deep, #c85d00);
      }

      .v530-focus-weekday {
        display: block;
        margin-top: 3px;
        color: var(--orange-deep, #c85d00);
        font-size: 10px;
        font-weight: 850;
      }

      /* Contact birthday badge */
      .v530-birthday-badge {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        gap: 4px;
        margin-top: 5px;
        border: 1px solid #ffd3aa;
        border-radius: 999px;
        padding: 4px 7px;
        background: #fff5e9;
        color: #b65300;
        font-size: 9px;
        font-weight: 900;
        line-height: 1;
        white-space: nowrap;
      }

      /* Upcoming this week */
      .v530-week-panel {
        border-color: #ffd4ad;
        background:
          linear-gradient(180deg, #fffaf5 0%, #ffffff 72%);
      }

      .v530-week-panel .panel-heading {
        align-items: flex-start;
      }

      .v530-week-count {
        display: inline-flex;
        min-width: 30px;
        height: 30px;
        align-items: center;
        justify-content: center;
        border: 1px solid #ffd0a4;
        border-radius: 999px;
        background: #fff1df;
        color: #bf5700;
        font-size: 11px;
        font-weight: 900;
      }

      .v530-week-list {
        display: grid;
        gap: 10px;
      }

      .v530-week-row {
        display: grid;
        grid-template-columns: minmax(170px, 1.2fr) minmax(125px, .65fr) auto;
        align-items: center;
        gap: 13px;
        border: 1px solid var(--line);
        border-radius: 15px;
        padding: 12px 13px;
        background: #fff;
      }

      .v530-week-when strong,
      .v530-week-when span {
        display: block;
      }

      .v530-week-when strong {
        color: var(--orange-deep, #c85d00);
        font-size: 12px;
      }

      .v530-week-when span {
        margin-top: 3px;
        color: var(--muted);
        font-size: 10px;
      }

      .v530-week-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px;
      }

      .v530-action {
        display: inline-flex;
        min-height: 34px;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 0 10px;
        background: #fff;
        color: var(--navy);
        font-size: 10px;
        font-weight: 850;
        text-decoration: none;
        cursor: pointer;
      }

      .v530-action:hover,
      .v530-action:focus-visible {
        border-color: #ffb36b;
        background: #fff8f1;
        outline: none;
      }

      .v530-action.wish {
        border-color: #ffc48c;
        background: #fff0df;
        color: #b65300;
      }

      /* Friendly empty states */
      .v530-empty {
        display: grid;
        justify-items: center;
        gap: 6px;
        padding: 24px 16px;
        border: 1px dashed #d5dfeb;
        border-radius: 15px;
        background: #fafcff;
        text-align: center;
      }

      .v530-empty-icon {
        font-size: 28px;
        line-height: 1;
      }

      .v530-empty strong {
        color: var(--text);
        font-size: 13px;
      }

      .v530-empty span {
        max-width: 420px;
        color: var(--muted);
        font-size: 10px;
        line-height: 1.5;
      }

      .v530-empty button {
        margin-top: 5px;
      }

      /* Yearly month colour coding: subtle accents only */
      #yearlyGrid .month-card {
        position: relative;
        overflow: hidden;
        box-shadow:
          inset 4px 0 0 var(--v530-month-accent, #2d6cdf),
          0 7px 22px rgba(18, 58, 107, .045);
      }

      #yearlyGrid .month-card .month-heading h3 {
        color: var(--v530-month-accent, var(--navy));
      }

      #yearlyGrid .month-card .month-count {
        border-color: color-mix(in srgb, var(--v530-month-accent) 25%, white);
        background: var(--v530-month-soft, #f3f7ff);
        color: var(--v530-month-accent, var(--navy));
      }

      #yearlyGrid .month-card:nth-child(12n + 1)  { --v530-month-accent: #2d6cdf; --v530-month-soft: #eaf2ff; }
      #yearlyGrid .month-card:nth-child(12n + 2)  { --v530-month-accent: #7956c8; --v530-month-soft: #f1edff; }
      #yearlyGrid .month-card:nth-child(12n + 3)  { --v530-month-accent: #23815c; --v530-month-soft: #eaf8f1; }
      #yearlyGrid .month-card:nth-child(12n + 4)  { --v530-month-accent: #c76513; --v530-month-soft: #fff3e6; }
      #yearlyGrid .month-card:nth-child(12n + 5)  { --v530-month-accent: #b33f6d; --v530-month-soft: #fff0f6; }
      #yearlyGrid .month-card:nth-child(12n + 6)  { --v530-month-accent: #16809a; --v530-month-soft: #e9f8fb; }
      #yearlyGrid .month-card:nth-child(12n + 7)  { --v530-month-accent: #8a6a00; --v530-month-soft: #fff8df; }
      #yearlyGrid .month-card:nth-child(12n + 8)  { --v530-month-accent: #4057b2; --v530-month-soft: #edf0ff; }
      #yearlyGrid .month-card:nth-child(12n + 9)  { --v530-month-accent: #9a5135; --v530-month-soft: #fff1ec; }
      #yearlyGrid .month-card:nth-child(12n + 10) { --v530-month-accent: #327447; --v530-month-soft: #ecf8ef; }
      #yearlyGrid .month-card:nth-child(12n + 11) { --v530-month-accent: #8052a8; --v530-month-soft: #f6effc; }
      #yearlyGrid .month-card:nth-child(12n + 12) { --v530-month-accent: #b94747; --v530-month-soft: #fff0f0; }

      /* Stronger mobile bottom-nav active state */
      .mobile-bottom-nav .bottom-nav-button {
        border-radius: 14px;
        transition:
          background-color .16s ease,
          color .16s ease,
          transform .16s ease;
      }

      .mobile-bottom-nav .bottom-nav-button.active {
        background: #fff0df;
        color: #c65b00;
        transform: translateY(-2px);
      }

      .mobile-bottom-nav .bottom-nav-button.active .bottom-nav-icon {
        display: grid;
        min-width: 32px;
        height: 30px;
        place-items: center;
        border-radius: 10px;
        background: #ffe2c2;
      }

      @media (max-width: 760px) {
        .mobile-dashboard-intro .today-date-label {
          display: none;
        }

        .v530-week-row {
          grid-template-columns: 1fr;
          align-items: start;
        }

        .v530-week-actions {
          justify-content: flex-start;
        }
      }

      @media (max-width: 430px) {
        .v530-week-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: 100%;
        }

        .v530-action {
          padding: 0 6px;
          font-size: 9px;
        }

        .mobile-bottom-nav {
          gap: 3px;
        }

        .mobile-bottom-nav .bottom-nav-button {
          padding-left: 4px;
          padding-right: 4px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureDateDetails() {
    if (byId("v530DateDetails")) return;

    const timezone = document.querySelector(
      ".date-time-card .timezone-label"
    );

    if (!timezone) return;

    const details = document.createElement("div");
    details.id = "v530DateDetails";
    details.className = "v530-date-details";
    details.innerHTML = `
      <strong id="v530DayName">—</strong>
      <span id="v530FullDate">—</span>
    `;

    timezone.insertAdjacentElement(
      "afterend",
      details
    );
  }

  function updateDateDetails() {
    ensureDateDetails();

    const now = new Date();

    const day = new Intl.DateTimeFormat(
      "en-GB",
      { weekday: "long" }
    ).format(now);

    const date = new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(now);

    const dayEl = byId("v530DayName");
    const dateEl = byId("v530FullDate");

    if (dayEl) dayEl.textContent = day;
    if (dateEl) dateEl.textContent = date;
  }

  function nextBirthdayRecord() {
    try {
      if (
        typeof contactsWithBirthday !== "function" ||
        typeof nextBirthdayDate !== "function"
      ) {
        return null;
      }

      const today = new Date();

      const records = contactsWithBirthday()
        .map((contact) => ({
          contact,
          date: nextBirthdayDate(contact.birthday),
        }))
        .filter((item) => item.date instanceof Date)
        .sort((a, b) => a.date - b.date);

      if (!records.length) return null;

      const item = records[0];

      const days =
        typeof dayDifference === "function"
          ? Math.max(0, dayDifference(today, item.date))
          : Math.max(
              0,
              Math.ceil(
                (item.date.setHours(0, 0, 0, 0) -
                  new Date().setHours(0, 0, 0, 0)) /
                  86400000
              )
            );

      return {
        ...item,
        days,
      };
    } catch (error) {
      console.warn(
        "v5.3 next birthday enhancement skipped:",
        error
      );
      return null;
    }
  }

  function enhanceBirthdayFocus() {
    const card = document.querySelector(
      ".birthday-focus-card"
    );

    if (!card) return;

    card.classList.add("v530-focus-card");

    const label = card.querySelector(
      ".focus-days-label"
    );

    if (label) {
      label.textContent = "Days Left";
    }

    let weekday = byId("v530FocusWeekday");

    if (!weekday) {
      weekday = document.createElement("span");
      weekday.id = "v530FocusWeekday";
      weekday.className = "v530-focus-weekday";

      const meta = byId("focusBirthdayMeta");

      if (meta) {
        meta.insertAdjacentElement(
          "afterend",
          weekday
        );
      }
    }

    const record = nextBirthdayRecord();

    if (!record) {
      if (weekday) weekday.textContent = "";
      return;
    }

    const dayName = new Intl.DateTimeFormat(
      "en-GB",
      { weekday: "long" }
    ).format(record.date);

    if (weekday) {
      weekday.textContent = dayName;
    }

    const daysEl = byId("focusDaysCount");

    if (daysEl) {
      daysEl.textContent = String(record.days);
    }

    const dateEl = byId("focusBirthdayDate");

    if (
      dateEl &&
      typeof formatDate === "function"
    ) {
      dateEl.textContent = formatDate(
        record.date,
        false
      );
    }
  }

  function ensureUpcomingWeekPanel() {
    if (byId("v530WeekPanel")) return;

    const upcoming30List = byId("upcomingList");
    const upcoming30Panel =
      upcoming30List?.closest(".panel");

    if (!upcoming30Panel) return;

    const panel = document.createElement("div");
    panel.id = "v530WeekPanel";
    panel.className = "panel v530-week-panel";
    panel.innerHTML = `
      <div class="panel-heading">
        <div>
          <span class="field-label">Quick Actions</span>
          <h3>Upcoming This Week</h3>
        </div>
        <span id="v530WeekCount" class="v530-week-count">0</span>
      </div>

      <div id="v530WeekList" class="v530-week-list"></div>
    `;

    upcoming30Panel.parentElement.insertBefore(
      panel,
      upcoming30Panel
    );
  }

  function renderUpcomingWeek() {
    ensureUpcomingWeekPanel();

    const list = byId("v530WeekList");
    const count = byId("v530WeekCount");

    if (!list || !count) return;

    let items = [];

    try {
      const today = new Date();

      items = (
        typeof contactsWithBirthday === "function"
          ? contactsWithBirthday()
          : []
      )
        .map((contact) => {
          const date = nextBirthdayDate(
            contact.birthday
          );

          return {
            contact,
            date,
            days: dayDifference(
              today,
              date
            ),
          };
        })
        .filter(
          (item) =>
            item.days >= 0 &&
            item.days <= 7
        )
        .sort(
          (a, b) =>
            a.date - b.date ||
            a.contact.name.localeCompare(
              b.contact.name
            )
        );
    } catch (error) {
      console.warn(
        "Upcoming week could not be rendered:",
        error
      );
    }

    count.textContent = String(items.length);

    if (!items.length) {
      list.innerHTML = `
        <div class="v530-empty">
          <div class="v530-empty-icon">🎉</div>
          <strong>No birthdays this week</strong>
          <span>
            You're all caught up. Sync Contacts to check for any newly added birthdays.
          </span>
          <button
            class="secondary-button v530-sync-contacts"
            type="button"
          >
            ↻ Sync Contacts
          </button>
        </div>
      `;
      return;
    }

    list.innerHTML = items
      .map(({ contact, date, days }) => {
        const number =
          contact.whatsapp ||
          contact.mobile ||
          "";

        const dayLabel =
          days === 0
            ? "Today"
            : days === 1
              ? "Tomorrow"
              : `${days} Days Left`;

        const dateText =
          typeof formatDate === "function"
            ? formatDate(date, false)
            : date.toLocaleDateString("en-GB");

        const weekday =
          new Intl.DateTimeFormat(
            "en-GB",
            { weekday: "long" }
          ).format(date);

        const avatar =
          typeof avatarToneClass === "function"
            ? avatarToneClass(contact.name)
            : "";

        const first =
          typeof initial === "function"
            ? initial(contact.name)
            : String(contact.name || "?")
                .trim()
                .charAt(0)
                .toUpperCase();

        const safeName =
          typeof escapeHtml === "function"
            ? escapeHtml(contact.name)
            : contact.name;

        const safeNumber =
          typeof escapeHtml === "function"
            ? escapeHtml(number)
            : number;

        const callHref =
          typeof callUrl === "function"
            ? callUrl(contact.mobile)
            : `tel:${contact.mobile || ""}`;

        const whatsappHref =
          typeof whatsappUrl === "function"
            ? whatsappUrl(number)
            : "#";

        return `
          <article class="v530-week-row">
            <div class="person">
              <span class="avatar ${avatar}">
                ${first}
              </span>

              <div class="person-text">
                <strong>${safeName}</strong>
                <small>${safeNumber || "Birthday contact"}</small>
              </div>
            </div>

            <div class="v530-week-when">
              <strong>${dayLabel}</strong>
              <span>${dateText} · ${weekday}</span>
            </div>

            <div class="v530-week-actions">
              <a
                class="v530-action"
                href="${callHref}"
              >
                📞 Call
              </a>

              <a
                class="v530-action"
                href="${whatsappHref}"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp
              </a>

              <button
                class="v530-action wish wish-open-button"
                type="button"
                data-name="${safeName}"
                data-number="${safeNumber}"
              >
                🎁 Create Wish
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function installBirthdayBadgeHook() {
    if (
      typeof contactRowHtml !== "function" ||
      contactRowHtml.__v530Wrapped
    ) {
      return;
    }

    const original = contactRowHtml;

    const wrapped = function v530ContactRowHtml(contact) {
      let html = original(contact);

      if (!contact?.birthday) {
        return html;
      }

      const badge = `
        <span class="v530-birthday-badge">
          🎂 Birthday Available
        </span>
      `;

      const personTextStart =
        html.indexOf(
          '<div class="person-text">'
        );

      if (personTextStart < 0) {
        return html;
      }

      const personTextEnd =
        html.indexOf(
          "</div>",
          personTextStart
        );

      if (personTextEnd < 0) {
        return html;
      }

      html =
        html.slice(0, personTextEnd) +
        badge +
        html.slice(personTextEnd);

      return html;
    };

    wrapped.__v530Wrapped = true;
    contactRowHtml = wrapped;
  }

  function installFriendlyEmptyHook() {
    if (
      typeof emptyHtml !== "function" ||
      emptyHtml.__v530Wrapped
    ) {
      return;
    }

    const original = emptyHtml;

    const wrapped = function v530EmptyHtml(message) {
      const text = String(message || "");

      if (
        /birthday/i.test(text) &&
        !/matching contacts/i.test(text)
      ) {
        return `
          <div class="empty v530-empty">
            <div class="v530-empty-icon">🎉</div>
            <strong>No birthdays here right now</strong>
            <span>${text}</span>
            <button
              class="secondary-button v530-sync-contacts"
              type="button"
            >
              ↻ Sync Contacts
            </button>
          </div>
        `;
      }

      return original(message);
    };

    wrapped.__v530Wrapped = true;
    emptyHtml = wrapped;
  }

  function installRenderHooks() {
    if (
      typeof renderDashboard === "function" &&
      !renderDashboard.__v530Wrapped
    ) {
      const originalDashboard = renderDashboard;

      const wrappedDashboard =
        function v530RenderDashboard() {
          const result =
            originalDashboard.apply(
              this,
              arguments
            );

          ensureDateDetails();
          updateDateDetails();
          enhanceBirthdayFocus();
          renderUpcomingWeek();

          return result;
        };

      wrappedDashboard.__v530Wrapped = true;
      renderDashboard = wrappedDashboard;
    }

    if (
      typeof renderYearly === "function" &&
      !renderYearly.__v530Wrapped
    ) {
      const originalYearly = renderYearly;

      const wrappedYearly =
        function v530RenderYearly() {
          const result =
            originalYearly.apply(
              this,
              arguments
            );

          // CSS nth-child month accents are applied after render.
          return result;
        };

      wrappedYearly.__v530Wrapped = true;
      renderYearly = wrappedYearly;
    }
  }

  function bindV530Events() {
    document.addEventListener(
      "click",
      (event) => {
        const syncButton =
          event.target.closest(
            ".v530-sync-contacts"
          );

        if (!syncButton) return;

        if (
          typeof syncOrAuthorize ===
          "function"
        ) {
          syncOrAuthorize();
        }
      }
    );
  }

  function updateVisibleVersion() {
    document
      .querySelectorAll(
        ".sidebar-brand small"
      )
      .forEach((element) => {
        if (
          /Private Device v/i.test(
            element.textContent || ""
          )
        ) {
          element.textContent =
            `Private Device v${BUILD_VERSION}`;
        }
      });

    const version = byId(
      "appVersionText"
    );

    if (version) {
      version.textContent =
        `Birthday Reminder v${BUILD_VERSION}`;
    }

    const versionCard =
      version?.closest(
        ".settings-card"
      );

    const helper =
      versionCard?.querySelector(
        ".settings-helper-text"
      );

    if (helper) {
      helper.textContent =
        `Build: v${BUILD_VERSION} · Dashboard & Quick Actions`;
    }

    const meta =
      document.querySelector(
        'meta[name="app-build"]'
      );

    if (meta) {
      meta.setAttribute(
        "content",
        "privacy-first-device-v5.3.0-dashboard-quick-actions"
      );
    }
  }

  function initializeV530() {
    installV530Styles();
    installBirthdayBadgeHook();
    installFriendlyEmptyHook();
    installRenderHooks();
    bindV530Events();
    updateVisibleVersion();

    ensureDateDetails();
    updateDateDetails();
    enhanceBirthdayFocus();
    renderUpcomingWeek();

    window.setInterval(
      updateDateDetails,
      60 * 1000
    );
  }

  // This file is injected after the app's main script, but before
  // DOMContentLoaded normally fires. Install wrappers immediately.
  initializeV530();
})();