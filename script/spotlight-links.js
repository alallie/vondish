(function (global) {
  "use strict";

  var STORAGE_KEY = "site-spotlight-settings";
  var DEFAULT_SETTINGS = {
    shortcut: { ctrl: true, alt: false, shift: true, meta: false, key: "k", code: "KeyK" },
    openInNewTab: true
  };
  var styles = `
    .ss-backdrop{position:fixed;inset:0;z-index:2147483645;display:flex;align-items:flex-start;justify-content:center;padding:clamp(16px,12vh,110px) 16px 24px;background:rgba(7,10,18,.54);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f6f7fb}
    .ss-backdrop[hidden],.ss-orb[hidden]{display:none}
    .ss-window{width:min(660px,100%);max-height:min(720px,82vh);overflow:hidden;border:1px solid rgba(255,255,255,.15);border-radius:18px;background:rgba(27,30,40,.97);box-shadow:0 28px 90px rgba(0,0,0,.5);animation:ss-appear .16s ease-out}
    @keyframes ss-appear{from{opacity:0;transform:translateY(-8px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
    .ss-searchbar{display:flex;align-items:center;gap:14px;padding:17px 19px;border-bottom:1px solid rgba(255,255,255,.1)}
    .ss-search-icon{width:23px;height:23px;flex:none;color:#aeb5c5}
    .ss-input{width:100%;border:0;outline:0;background:transparent;color:#fff;font-family:inherit;font-size:20px;font-weight:400;line-height:1.4}
    .ss-input::placeholder{color:#9299a9}
    .ss-settings-button,.ss-close-button{display:grid;place-items:center;flex:none;width:36px;height:36px;border:0;border-radius:10px;background:transparent;color:#b9c0ce;cursor:pointer}
    .ss-settings-button:hover,.ss-close-button:hover{background:rgba(255,255,255,.1);color:white}
    .ss-settings-button svg,.ss-close-button svg{width:19px;height:19px}
    .ss-results{max-height:min(470px,57vh);overflow:auto;padding:7px}
    .ss-result{display:flex;align-items:center;gap:13px;width:100%;padding:12px;border:0;border-radius:11px;background:transparent;color:inherit;text-align:left;cursor:pointer}
    .ss-result:hover,.ss-result[aria-selected="true"]{background:rgba(116,142,255,.2)}
    .ss-result-icon{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,.09);color:#bac6ff}
    .ss-result-icon svg{width:19px;height:19px}
    .ss-result-copy{min-width:0;flex:1}
    .ss-result-title,.ss-result-url{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ss-result-title{font-size:14px;font-weight:600;line-height:1.45}
    .ss-result-context{display:block;overflow:hidden;margin-top:2px;color:#c0c6d3;font-size:12px;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}
    .ss-result-context[hidden]{display:none}
    .ss-result-url{margin-top:3px;color:#a6adbb;font-size:12px;line-height:1.4}
    .ss-result-hint{flex:none;color:#a6adbb;font-size:11px}
    .ss-empty{padding:30px 20px;color:#aeb5c5;text-align:center;font-size:13px}
    .ss-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 17px;border-top:1px solid rgba(255,255,255,.1);color:#aeb5c5;font-size:11px}
    .ss-keys{display:flex;gap:5px;align-items:center}
    .ss-keys kbd{padding:3px 6px;border:1px solid rgba(255,255,255,.2);border-radius:5px;background:rgba(255,255,255,.06);font:inherit}
    .ss-settings{padding:18px 20px 20px;border-top:1px solid rgba(255,255,255,.1)}
    .ss-settings[hidden]{display:none}
    .ss-settings h2{margin:0 0 15px;font-size:15px}
    .ss-setting-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:11px 0}
    .ss-setting-copy{font-size:13px}
    .ss-setting-copy small{display:block;margin-top:4px;color:#aeb5c5;font-size:11px}
    .ss-shortcut-button,.ss-reset-button{padding:8px 11px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.07);color:#f6f7fb;font:inherit;cursor:pointer}
    .ss-shortcut-button:hover,.ss-reset-button:hover{background:rgba(255,255,255,.14)}
    .ss-checkbox{width:17px;height:17px;accent-color:#8296ff}
    .ss-status{min-height:16px;margin:6px 0 0;color:#ffcf80;font-size:11px}
    .ss-reset-button{margin-top:8px;color:#d9deea}
    .ss-orb{position:fixed;left:18px;bottom:18px;z-index:2147483644;display:block;width:52px;height:52px;padding:0;border:1px solid rgba(255,255,255,.48);border-radius:50%;background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.3),rgba(226,234,255,.12) 48%,rgba(156,174,216,.2));box-shadow:inset 0 1px 2px rgba(255,255,255,.32),inset 0 -2px 6px rgba(38,51,78,.12),0 4px 16px rgba(24,34,54,.12);backdrop-filter:blur(10px) saturate(135%);-webkit-backdrop-filter:blur(10px) saturate(135%);cursor:pointer;transition:transform .15s,border-color .15s,background .15s}
    .ss-orb:hover{transform:scale(1.05);border-color:rgba(255,255,255,.7);background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.38),rgba(226,234,255,.16) 48%,rgba(156,174,216,.26))}
    .ss-orb:focus-visible{outline:2px solid rgba(255,255,255,.9);outline-offset:3px}
    @media(max-width:520px){.ss-backdrop{padding:8vh 10px 12px}.ss-window{border-radius:15px}.ss-searchbar{gap:10px;padding:13px}.ss-input{font-size:17px}.ss-results{max-height:62vh}.ss-result-hint{display:none}.ss-footer{padding:10px 13px}.ss-orb{left:15px;bottom:15px}}
    @media(prefers-reduced-motion:reduce){.ss-window{animation:none}.ss-orb{transition:none}}
  `;
  var searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>';
  var settingsIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 2.8h3l.6 2.4a7.3 7.3 0 0 1 1.5.9l2.4-.7 1.5 2.6-1.8 1.7a7 7 0 0 1 0 1.8l1.8 1.7-1.5 2.6-2.4-.7a7.3 7.3 0 0 1-1.5.9l-.6 2.4h-3l-.6-2.4a7.3 7.3 0 0 1-1.5-.9l-2.4.7-1.5-2.6 1.8-1.7a7 7 0 0 1 0-1.8L4.5 8l1.5-2.6 2.4.7a7.3 7.3 0 0 1 1.5-.9z"/><circle cx="12" cy="10.8" r="2.7"/></svg>';
  var linkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7"/><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 19.2l1.7-1.7"/></svg>';

  function cloneDefaults() {
    return {
      shortcut: {
        ctrl: DEFAULT_SETTINGS.shortcut.ctrl,
        alt: DEFAULT_SETTINGS.shortcut.alt,
        shift: DEFAULT_SETTINGS.shortcut.shift,
        meta: DEFAULT_SETTINGS.shortcut.meta,
        key: DEFAULT_SETTINGS.shortcut.key,
        code: DEFAULT_SETTINGS.shortcut.code
      },
      openInNewTab: DEFAULT_SETTINGS.openInNewTab
    };
  }

  function readSettings() {
    try {
      var stored = global.localStorage.getItem(STORAGE_KEY);
      if (!stored) return { settings: cloneDefaults(), error: "" };
      var parsed = JSON.parse(stored);
      var shortcut = parsed && parsed.shortcut;
      if (!shortcut || typeof shortcut.key !== "string" || typeof shortcut.code !== "string") {
        return { settings: cloneDefaults(), error: "Saved settings were invalid and have been ignored." };
      }
      return {
        settings: {
          shortcut: {
            ctrl: Boolean(shortcut.ctrl),
            alt: Boolean(shortcut.alt),
            shift: Boolean(shortcut.shift),
            meta: Boolean(shortcut.meta),
            key: shortcut.key,
            code: shortcut.code
          },
          openInNewTab: parsed.openInNewTab !== false
        },
        error: ""
      };
    } catch (error) {
      return { settings: cloneDefaults(), error: "Settings could not be read from local storage." };
    }
  }

  function shortcutLabel(shortcut) {
    var parts = [];
    if (shortcut.ctrl) parts.push("Ctrl");
    if (shortcut.alt) parts.push("Alt/Option");
    if (shortcut.shift) parts.push("Shift");
    if (shortcut.meta) parts.push("Command/Meta");
    parts.push(shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key);
    return parts.join(" + ");
  }

  function init() {
    if (document.getElementById("site-spotlight")) return;
    var stored = readSettings();
    var settings = stored.settings;
    var selectedIndex = -1;
    var items = [];
    var isOpen = false;
    var shortcutCapture = false;
    var previousFocus = null;
    var style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);

    var backdrop = document.createElement("div");
    backdrop.id = "site-spotlight";
    backdrop.className = "ss-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <section class="ss-window" role="dialog" aria-modal="true" aria-label="Search this website">
        <div class="ss-searchbar">
          <span class="ss-search-icon">${searchIcon}</span>
          <input class="ss-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search links on this page…" aria-label="Search links">
          <button class="ss-settings-button" type="button" aria-label="Search settings" title="Settings">${settingsIcon}</button>
          <button class="ss-close-button" type="button" aria-label="Close search" title="Close">×</button>
        </div>
        <div class="ss-results" role="listbox" aria-label="Search results"></div>
        <div class="ss-settings" hidden>
          <h2>Search settings</h2>
          <div class="ss-setting-row">
            <div class="ss-setting-copy">Keyboard shortcut<small>Click, then press a key combination with at least one modifier.</small></div>
            <button class="ss-shortcut-button" type="button"></button>
          </div>
          <label class="ss-setting-row">
            <span class="ss-setting-copy">Open links in a new tab<small>Turn off to navigate in the current tab.</small></span>
            <input class="ss-checkbox" type="checkbox">
          </label>
          <p class="ss-status" aria-live="polite"></p>
          <button class="ss-reset-button" type="button">Reset to defaults</button>
        </div>
        <div class="ss-footer"><span class="ss-count"></span><span class="ss-keys"><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>Esc</kbd> close</span></div>
      </section>`;
    document.body.appendChild(backdrop);

    var orb = document.createElement("button");
    orb.className = "ss-orb";
    orb.type = "button";
    orb.setAttribute("aria-label", "Search links");
    orb.title = "Search links";
    document.body.appendChild(orb);

    var input = backdrop.querySelector(".ss-input");
    var results = backdrop.querySelector(".ss-results");
    var count = backdrop.querySelector(".ss-count");
    var settingsPanel = backdrop.querySelector(".ss-settings");
    var settingsButton = backdrop.querySelector(".ss-settings-button");
    var closeButton = backdrop.querySelector(".ss-close-button");
    var shortcutButton = backdrop.querySelector(".ss-shortcut-button");
    var openNewTabCheckbox = backdrop.querySelector(".ss-checkbox");
    var status = backdrop.querySelector(".ss-status");

    function setStatus(message) {
      status.textContent = message;
    }

    function saveSettings() {
      try {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setStatus("Settings saved on this device.");
      } catch (error) {
        setStatus("Could not save settings. Check your browser's local storage permissions.");
      }
      updateSettingsControls();
    }

    function updateSettingsControls() {
      shortcutButton.textContent = shortcutCapture ? "Press shortcut…" : shortcutLabel(settings.shortcut);
      openNewTabCheckbox.checked = settings.openInNewTab;
    }

    function linkEntries(query) {
      var terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      return Array.prototype.map.call(document.querySelectorAll("a[href]"), function (anchor) {
        var rawHref = anchor.getAttribute("href");
        var url;
        try {
          url = new URL(rawHref, document.baseURI);
        } catch (error) {
          return null;
        }
        if (!/^(https?:|mailto:|tel:|file:)$/.test(url.protocol)) return null;
        var anchorText = (anchor.innerText || anchor.textContent || "").trim().replace(/\s+/g, " ");
        var title = (anchor.getAttribute("title") || "").trim();
        var pageTitle = document.title.trim();
        var searchable = [anchorText, title, pageTitle, url.href, rawHref].join(" ").toLocaleLowerCase();
        if (terms.some(function (term) { return !searchable.includes(term); })) return null;
        return {
          anchor: anchor,
          href: url.href,
          text: anchorText || title || url.href,
          title: title,
          displayUrl: url.href.replace(/^https?:\/\//, "")
        };
      }).filter(Boolean);
    }

    function openEntry(entry) {
      if (!entry) return;
      if (settings.openInNewTab) {
        global.open(entry.href, "_blank", "noopener,noreferrer");
        close();
      } else {
        close();
        global.location.assign(entry.href);
      }
    }

    function select(index) {
      selectedIndex = index;
      Array.prototype.forEach.call(results.querySelectorAll(".ss-result"), function (row, rowIndex) {
        row.setAttribute("aria-selected", rowIndex === selectedIndex ? "true" : "false");
        if (rowIndex === selectedIndex) row.scrollIntoView({ block: "nearest" });
      });
    }

    function render() {
      var query = input.value;
      results.textContent = "";
      selectedIndex = -1;
      if (!query.trim()) {
        items = [];
        count.textContent = "Search anchor text, titles, and URLs";
        var prompt = document.createElement("div");
        prompt.className = "ss-empty";
        prompt.textContent = "Start typing to find links anywhere on this page.";
        results.appendChild(prompt);
        return;
      }
      items = linkEntries(query).slice(0, 100);
      count.textContent = items.length + (items.length === 1 ? " result" : " results");
      if (!items.length) {
        var empty = document.createElement("div");
        empty.className = "ss-empty";
        empty.textContent = "No matching links found.";
        results.appendChild(empty);
        return;
      }
      items.forEach(function (item, index) {
        var row = document.createElement("button");
        row.type = "button";
        row.className = "ss-result";
        row.setAttribute("role", "option");
        row.setAttribute("aria-selected", "false");
        row.innerHTML = '<span class="ss-result-icon">' + linkIcon + '</span><span class="ss-result-copy"><span class="ss-result-title"></span><span class="ss-result-context"></span><span class="ss-result-url"></span></span><span class="ss-result-hint">↵</span>';
        row.querySelector(".ss-result-title").textContent = item.text;
        var context = row.querySelector(".ss-result-context");
        context.textContent = item.title;
        context.hidden = !item.title;
        row.querySelector(".ss-result-url").textContent = item.displayUrl;
        row.addEventListener("mouseenter", function () { select(index); });
        row.addEventListener("click", function () { openEntry(item); });
        results.appendChild(row);
      });
      select(0);
    }

    function open() {
      if (isOpen) return;
      previousFocus = document.activeElement;
      isOpen = true;
      backdrop.hidden = false;
      input.value = "";
      settingsPanel.hidden = true;
      render();
      input.focus();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      backdrop.hidden = true;
      shortcutCapture = false;
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    }

    function shortcutMatches(event) {
      var shortcut = settings.shortcut;
      var keyMatch = shortcut.code ? event.code === shortcut.code : event.key.toLowerCase() === shortcut.key.toLowerCase();
      return keyMatch && event.ctrlKey === shortcut.ctrl && event.altKey === shortcut.alt &&
        event.shiftKey === shortcut.shift && event.metaKey === shortcut.meta;
    }

    input.addEventListener("input", render);
    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" && items.length) {
        event.preventDefault();
        select((selectedIndex + 1) % items.length);
      } else if (event.key === "ArrowUp" && items.length) {
        event.preventDefault();
        select((selectedIndex - 1 + items.length) % items.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        openEntry(items[selectedIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    });
    settingsButton.addEventListener("click", function () {
      settingsPanel.hidden = !settingsPanel.hidden;
      if (!settingsPanel.hidden) shortcutButton.focus();
    });
    closeButton.addEventListener("click", close);
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) close();
    });
    orb.addEventListener("click", open);
    shortcutButton.addEventListener("click", function () {
      shortcutCapture = true;
      setStatus("Press your preferred shortcut now.");
      updateSettingsControls();
      shortcutButton.focus();
    });
    shortcutButton.addEventListener("keydown", function (event) {
      if (shortcutCapture && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        shortcutCapture = false;
        setStatus("Shortcut change cancelled.");
        updateSettingsControls();
        return;
      }
      if (!shortcutCapture || ["Control", "Alt", "Shift", "Meta"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
        setStatus("Use at least one modifier key (Ctrl, Alt/Option, Shift, or Command).");
        return;
      }
      settings.shortcut = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey,
        key: event.key,
        code: event.code
      };
      shortcutCapture = false;
      saveSettings();
    });
    openNewTabCheckbox.addEventListener("change", function () {
      settings.openInNewTab = openNewTabCheckbox.checked;
      saveSettings();
    });
    backdrop.querySelector(".ss-reset-button").addEventListener("click", function () {
      try {
        global.localStorage.removeItem(STORAGE_KEY);
        settings = cloneDefaults();
        setStatus("Defaults restored; saved settings cleared.");
      } catch (error) {
        settings = cloneDefaults();
        setStatus("Defaults restored for this visit, but saved settings could not be cleared.");
      }
      updateSettingsControls();
    });
    document.addEventListener("keydown", function (event) {
      if (isOpen && event.key === "Escape") {
        event.preventDefault();
        if (shortcutCapture) {
          shortcutCapture = false;
          setStatus("Shortcut change cancelled.");
          updateSettingsControls();
        } else {
          close();
        }
        return;
      }
      if (shortcutCapture || !shortcutMatches(event)) return;
      event.preventDefault();
      open();
    });

    var mobilePointer = global.matchMedia && global.matchMedia("(hover: none) and (pointer: coarse)");
    function updateOrbVisibility() {
      orb.hidden = !mobilePointer || !mobilePointer.matches;
    }
    updateOrbVisibility();
    if (mobilePointer && typeof mobilePointer.addEventListener === "function") {
      mobilePointer.addEventListener("change", updateOrbVisibility);
    }
    updateSettingsControls();
    if (stored.error) setStatus(stored.error);
  }

  global.SiteSpotlight = init;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(window);
