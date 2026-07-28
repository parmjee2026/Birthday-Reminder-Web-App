(() => {
  "use strict";

  const BIRTHDAY_URL = "https://parmjee2026.github.io/Birthday-Reminder-Web-App/";
  const JAPA_URL = "https://parmeshwarbtpl-rgb.github.io/japa-counter/";

  const path = window.location.pathname.toLowerCase();
  const title = document.title.toLowerCase();

  const current =
    path.includes("japa-counter") ||
    title.includes("naam jaap")
      ? "japa"
      : "birthday";

  const SHARED_IDENTITY_KEY =
    "myApps.displayIdentity.v1";

  function readSharedIdentity() {
    try {
      const value = JSON.parse(
        localStorage.getItem(
          SHARED_IDENTITY_KEY
        ) || "{}"
      );

      return {
        name: usableName(value.name)
      };
    } catch (error) {
      console.warn(
        "Shared display identity could not be read:",
        error
      );

      return {
        name: ""
      };
    }
  }

  function saveSharedIdentity(name) {
    const safeName =
      usableName(name).slice(0, 80);

    if (!safeName) return;

    try {
      localStorage.setItem(
        SHARED_IDENTITY_KEY,
        JSON.stringify({
          name: safeName,
          savedAt: Date.now()
        })
      );
    } catch (error) {
      console.warn(
        "Shared display identity could not be saved:",
        error
      );
    }
  }

  function saveBirthdayIdentity(name) {
    if (current !== "birthday") return;

    const safeName =
      usableName(name).slice(0, 80);

    if (!safeName) return;

    try {
      const key =
        "birthdayReminder.profile.v1";

      const profile = JSON.parse(
        localStorage.getItem(key) || "{}"
      );

      localStorage.setItem(
        key,
        JSON.stringify({
          name: safeName,
          status:
            String(
              profile.status || ""
            ).trim()
        })
      );

      if (
        typeof state !== "undefined" &&
        state
      ) {
        state.userName = safeName;

        if (
          typeof saveDevicePreferences ===
          "function"
        ) {
          saveDevicePreferences();
        }

        if (
          typeof renderUserName ===
          "function"
        ) {
          renderUserName();
        }
      }
    } catch (error) {
      console.warn(
        "Birthday display identity could not be saved:",
        error
      );
    }
  }

  function consumeIdentityHandoff() {
    const raw =
      window.location.hash
        .replace(/^#/, "");

    if (!raw) return;

    const params =
      new URLSearchParams(raw);

    const incomingName =
      usableName(
        params.get("suite_name")
      );

    if (incomingName) {
      saveSharedIdentity(incomingName);
      saveBirthdayIdentity(incomingName);
    }

    if (
      params.has("suite_name") ||
      params.has("suite_enter")
    ) {
      params.delete("suite_name");
      params.delete("suite_enter");

      const cleanHash =
        params.toString();

      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          window.location.search +
          (
            cleanHash
              ? `#${cleanHash}`
              : ""
          )
      );
    }
  }

  function switchWithIdentity(link) {
    const identity =
      readIdentity();

    const safeName =
      usableName(identity.name);

    if (safeName) {
      saveSharedIdentity(safeName);
    }

    const target =
      new URL(
        link.href,
        window.location.href
      );

    target.searchParams.set(
      "enter",
      "1"
    );

    const fragment =
      new URLSearchParams();

    if (safeName) {
      fragment.set(
        "suite_name",
        safeName
      );
    }

    fragment.set(
      "suite_enter",
      "1"
    );

    target.hash =
      fragment.toString();

    window.location.assign(
      target.toString()
    );
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/^welcome\s*,?\s*/i, "")
      .trim();
  }

  function usableName(value) {
    const name = cleanText(value);

    if (
      !name ||
      /^google user$/i.test(name) ||
      /^user$/i.test(name)
    ) {
      return "";
    }

    return name;
  }

  function firstInitial(name) {
    const clean = cleanText(name);
    return clean ? clean.charAt(0).toUpperCase() : "G";
  }

  function textFrom(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const text = element?.textContent?.trim();

      if (text) return text;
    }

    return "";
  }

  function birthdayIdentity() {
    let profile = {};

    try {
      profile = JSON.parse(
        localStorage.getItem("birthdayReminder.profile.v1") || "{}"
      );
    } catch (error) {
      console.warn("Birthday profile could not be read:", error);
    }

    let liveName = "";
    let liveStatus = "";
    let livePhotoUrl = "";

    try {
      if (
        typeof state !== "undefined" &&
        state
      ) {
        liveName =
          usableName(state.userName);

        liveStatus =
          String(
            state.userStatus || ""
          ).trim();

        livePhotoUrl =
          String(
            state.profilePhotoUrl || ""
          ).trim();
      }
    } catch (error) {
      console.warn(
        "Live Birthday profile could not be read:",
        error
      );
    }

    const name =
      liveName ||
      usableName(profile.name) ||
      usableName(
        readSharedIdentity().name
      ) ||
      usableName(
        textFrom([
          "#sidebarUserName",
          "#dashboardWelcome"
        ])
      ) ||
      "Birthday User";

    const status =
      liveStatus ||
      String(profile.status || "").trim() ||
      textFrom([
        "#topUserStatus",
        "#sidebarUserStatus"
      ]) ||
      "Private Google Contacts";

    return {
      name,
      status,
      photoUrl: livePhotoUrl,
      avatarSource:
        document.getElementById("topProfileCircle")
    };
  }

  function japaIdentity() {
    const name =
      usableName(
        textFrom([
          "#accountButton [data-user-name]",
          ".account-card [data-user-name]",
          "[data-user-name]"
        ])
      ) ||
      usableName(
        readSharedIdentity().name
      ) ||
      "User";

    const status =
      textFrom([
        "#accountButton [data-local-profile-status]",
        ".account-card [data-local-profile-status]",
        "[data-local-profile-status]"
      ]) ||
      (
        name === "Guest"
          ? "Choose an app to continue"
          : "Naam Jaap · Trusted Device"
      );

    return {
      name,
      status,
      avatarSource:
        document.querySelector(
          "#accountButton img, " +
          "img[data-user-photo], " +
          ".account-avatar img"
        ),
      initialSource:
        textFrom([
          "#accountButton [data-user-initial]",
          ".account-avatar",
          "[data-user-initial]"
        ])
    };
  }

  function readIdentity() {
    return current === "birthday"
      ? birthdayIdentity()
      : japaIdentity();
  }

  function applyAvatar(avatar, identity) {
    if (!avatar) return;

    let backgroundImage = "";
    let imageSource =
      String(identity.photoUrl || "").trim();

    const source = identity.avatarSource;

    if (source) {
      if (
        source instanceof HTMLImageElement &&
        !imageSource
      ) {
        imageSource =
          source.currentSrc ||
          source.src ||
          "";
      } else {
        backgroundImage =
          source.style.backgroundImage ||
          getComputedStyle(source).backgroundImage ||
          "";
      }
    }

    if (
      imageSource &&
      !imageSource.endsWith("#")
    ) {
      avatar.style.backgroundImage =
        `url("${imageSource.replace(/"/g, "%22")}")`;

      avatar.textContent = "";
      avatar.classList.add("has-photo");
      return;
    }

    if (
      backgroundImage &&
      backgroundImage !== "none" &&
      !backgroundImage.includes('url("")')
    ) {
      avatar.style.backgroundImage = backgroundImage;
      avatar.textContent = "";
      avatar.classList.add("has-photo");
      return;
    }

    avatar.style.backgroundImage = "";

    avatar.textContent =
      identity.initialSource?.trim()?.charAt(0)?.toUpperCase() ||
      firstInitial(identity.name);

    avatar.classList.remove("has-photo");
  }

  let birthdayPhotoObjectUrl = "";

  async function loadBirthdayPhotoFromIndexedDB() {
    if (
      current !== "birthday" ||
      birthdayPhotoObjectUrl
    ) {
      return birthdayPhotoObjectUrl;
    }

    if (!("indexedDB" in window)) {
      return "";
    }

    try {
      const db = await new Promise(
        (resolve, reject) => {
          const request = indexedDB.open(
            "BirthdayReminderPrivateDevice",
            1
          );

          request.onsuccess = () =>
            resolve(request.result);

          request.onerror = () =>
            reject(request.error);
        }
      );

      const record = await new Promise(
        (resolve, reject) => {
          const transaction =
            db.transaction(
              "cache",
              "readonly"
            );

          const request =
            transaction
              .objectStore("cache")
              .get("profilePhoto");

          request.onsuccess = () =>
            resolve(request.result || null);

          request.onerror = () =>
            reject(request.error);
        }
      );

      db.close();

      if (
        record?.blob instanceof Blob
      ) {
        birthdayPhotoObjectUrl =
          URL.createObjectURL(record.blob);
      }

      return birthdayPhotoObjectUrl;
    } catch (error) {
      console.warn(
        "Birthday profile photo fallback could not be loaded:",
        error
      );

      return "";
    }
  }


  async function updatePersonalHeader() {
    const identity = readIdentity();

    if (
      current === "birthday" &&
      !identity.photoUrl
    ) {
      identity.photoUrl =
        await loadBirthdayPhotoFromIndexedDB();
    }

    const nameElement =
      document.getElementById("embeddedSuiteUserName");

    const statusElement =
      document.getElementById("embeddedSuiteUserStatus");

    const avatar =
      document.getElementById("embeddedSuiteUserAvatar");

    if (nameElement) {
      nameElement.textContent = identity.name;
      nameElement.title = identity.name;
    }

    if (statusElement) {
      statusElement.textContent = identity.status;
      statusElement.title = identity.status;
    }

    applyAvatar(avatar, identity);
  }

  function card(kind) {
    const isBirthday = kind === "birthday";
    const isCurrent = kind === current;

    const tag = isCurrent ? "button" : "a";

    const attrs = isCurrent
      ? 'type="button" data-enter-current-app'
      : `href="${isBirthday ? BIRTHDAY_URL : JAPA_URL}?enter=1" data-switch-to-app`;

    const icon = isBirthday ? "🎂" : "ॐ";

    const name = isBirthday
      ? "Birthday Reminder"
      : "Naam Jaap Counter";

    const description = isBirthday
      ? "Privately manage birthdays, wishes, calendar exports, backups and your local contact copy."
      : "Continue your mantra counting, goals, history and secure account synchronization.";

    const tags = isBirthday
      ? `
        <span class="embedded-suite-tag">Contacts Read Only</span>
        <span class="embedded-suite-tag">Device Privacy</span>
        <span class="embedded-suite-tag">Calendar</span>
      `
      : `
        <span class="embedded-suite-tag">Jaap Counter</span>
        <span class="embedded-suite-tag">History</span>
        <span class="embedded-suite-tag">Secure Sync</span>
      `;

    return `
      <${tag}
        class="embedded-suite-card ${kind === "japa" ? "japa" : "birthday"}"
        ${attrs}
      >
        ${
          isCurrent
            ? '<span class="embedded-suite-current-badge">Current App</span>'
            : ""
        }

        <div class="embedded-suite-app-icon" aria-hidden="true">
          ${icon}
        </div>

        <h3>${name}</h3>

        <p>${description}</p>

        <div class="embedded-suite-tags">
          ${tags}
        </div>

        <div class="embedded-suite-open-row">
          <span>Open ${name}</span>
          <span class="embedded-suite-arrow" aria-hidden="true">→</span>
        </div>
      </${tag}>
    `;
  }

  function markup() {
    return `
      <section
        id="embeddedSuiteLauncher"
        class="embedded-suite-screen"
        aria-label="Your apps"
      >
        <div class="embedded-suite-shell">
          <header class="embedded-suite-hero">
            <div class="embedded-suite-personal-header">
              <div class="embedded-suite-personal-copy">
                <p class="embedded-suite-greeting">Welcome</p>

                <h1 id="embeddedSuiteUserName">Guest</h1>

                <div class="embedded-suite-status-row">
                  <span
                    class="embedded-suite-status-dot"
                    aria-hidden="true"
                  ></span>

                  <p
                    id="embeddedSuiteUserStatus"
                    class="embedded-suite-profile-status"
                  >
                    Choose an app to continue
                  </p>
                </div>
              </div>

              <div
                id="embeddedSuiteUserAvatar"
                class="embedded-suite-profile-avatar"
                aria-label="User profile"
              >
                G
              </div>
            </div>
          </header>

          <main class="embedded-suite-content">
            <section class="embedded-suite-welcome">
              <h2>Your Apps</h2>

              <p>
                Choose an app. Login, permissions and stored data remain separate.
              </p>
            </section>

            <section class="embedded-suite-grid" aria-label="Your apps">
              ${card("birthday")}
              ${card("japa")}
            </section>

            <section class="embedded-suite-privacy">
              <strong>🔒 Separate apps, separate data</strong>

              <span>
                Birthday Reminder contacts and Naam Jaap activity are never combined or transferred between apps.
              </span>
            </section>
          </main>

          <footer class="embedded-suite-footer">
            Choose an app to continue
          </footer>
        </div>
      </section>
    `;
  }

  function setup() {
    consumeIdentityHandoff();

    document.getElementById("headerAppSwitcherButton")?.remove();
    document.getElementById("myAppSwitcherLayer")?.remove();

    if (!document.getElementById("embeddedSuiteLauncher")) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        markup()
      );
    }

    const launcher =
      document.getElementById("embeddedSuiteLauncher");

    const birthdayHeaderButton =
      document.getElementById("appSwitcherButton");

    function show() {
      const oldLayer =
        document.getElementById("appSwitcherLayer");

      if (oldLayer) oldLayer.hidden = true;

      launcher.hidden = false;
      document.body.style.overflow = "hidden";
      launcher.scrollTop = 0;

      birthdayHeaderButton?.setAttribute(
        "aria-expanded",
        "true"
      );

      document
        .getElementById("embeddedSuiteHeaderButton")
        ?.setAttribute("aria-expanded", "true");

      updatePersonalHeader();
    }

    function hide() {
      launcher.hidden = true;
      document.body.style.overflow = "";

      birthdayHeaderButton?.setAttribute(
        "aria-expanded",
        "false"
      );

      document
        .getElementById("embeddedSuiteHeaderButton")
        ?.setAttribute("aria-expanded", "false");
    }

    launcher
      .querySelectorAll("[data-enter-current-app]")
      .forEach((button) => {
        button.addEventListener("click", hide);
      });

    launcher
      .querySelectorAll("[data-switch-to-app]")
      .forEach((link) => {
        link.removeAttribute("target");
        link.removeAttribute("rel");

        link.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            switchWithIdentity(link);
          }
        );
      });

    if (birthdayHeaderButton) {
      birthdayHeaderButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          show();
        },
        true
      );
    }

    if (current === "japa") {
      const header =
        document.querySelector(".app-header");

      const account =
        document.getElementById("accountButton");

      if (
        header &&
        account &&
        !document.getElementById("embeddedSuiteHeaderButton")
      ) {
        const button = document.createElement("button");

        button.id = "embeddedSuiteHeaderButton";
        button.className = "header-app-switcher-button";
        button.type = "button";
        button.title = "Your Apps";
        button.setAttribute("aria-label", "Open Your Apps");
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-expanded", "false");
        button.innerHTML =
          '<span aria-hidden="true">▦</span>';

        header.insertBefore(button, account);
        button.addEventListener("click", show);
      }

      const authCard =
        document.querySelector("#authGate .auth-card");

      if (
        authCard &&
        !document.getElementById("embeddedSuiteAuthButton")
      ) {
        const button = document.createElement("button");

        button.id = "embeddedSuiteAuthButton";
        button.className = "secondary-btn full-width";
        button.type = "button";
        button.textContent = "▦ Your Apps";
        button.addEventListener("click", show);

        const privacy =
          authCard.querySelector(".privacy-note");

        authCard.insertBefore(
          button,
          privacy || null
        );
      }
    } else {
      const actions =
        document.querySelector(".login-secondary-actions");

      if (
        actions &&
        !document.getElementById("loginEmbeddedSuiteButton")
      ) {
        const button = document.createElement("button");

        button.id = "loginEmbeddedSuiteButton";
        button.className =
          "secondary-button login-install-button";

        button.type = "button";
        button.textContent = "▦ Your Apps";
        button.addEventListener("click", show);

        actions.appendChild(button);
      }
    }

    const moreAppsCard =
      document.querySelector(".more-apps-card");

    if (moreAppsCard) {
      const buttonClass =
        current === "japa"
          ? "primary-btn full-width"
          : "orange-action-button";

      moreAppsCard.innerHTML = `
        <h3>App Switcher</h3>

        <p>
          Open Birthday Reminder or Naam Jaap Counter from one screen.
          Their data remains separate.
        </p>

        <button
          class="${buttonClass} embedded-suite-settings-button"
          type="button"
          data-open-embedded-suite
        >
          ▦ Open Your Apps
        </button>
      `;

      moreAppsCard
        .querySelector("[data-open-embedded-suite]")
        ?.addEventListener("click", show);
    }

    updatePersonalHeader();

    const profileTargets = [
      document.getElementById("topProfileCircle"),
      document.getElementById("sidebarUserName"),
      document.getElementById("sidebarUserStatus"),
      document.getElementById("topUserStatus")
    ].filter(Boolean);

    if (
      profileTargets.length &&
      "MutationObserver" in window
    ) {
      const profileObserver =
        new MutationObserver(
          updatePersonalHeader
        );

      profileTargets.forEach((target) => {
        profileObserver.observe(
          target,
          {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          }
        );
      });
    }

    window.setInterval(
      updatePersonalHeader,
      1200
    );

    window.addEventListener(
      "storage",
      updatePersonalHeader
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) updatePersonalHeader();
      }
    );

    const url = new URL(window.location.href);

    if (url.searchParams.get("enter") === "1") {
      hide();
      url.searchParams.delete("enter");

      window.history.replaceState(
        null,
        "",
        url.pathname +
          (url.search ? url.search : "") +
          url.hash
      );
    } else {
      show();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      setup,
      { once: true }
    );
  } else {
    setup();
  }
})();
