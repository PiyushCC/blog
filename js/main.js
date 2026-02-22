(function () {
  // Theme toggle
  const themeKey = "blog-theme";
  const toggle = document.querySelector(".theme-toggle");
  const body = document.body;

  function getStored() {
    return localStorage.getItem(themeKey) || "light";
  }

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    if (toggle) toggle.textContent = theme === "dark" ? "Light" : "Dark";
  }

  if (toggle) {
    applyTheme(getStored());
    toggle.addEventListener("click", function () {
      const next = getStored() === "dark" ? "light" : "dark";
      localStorage.setItem(themeKey, next);
      applyTheme(next);
    });
  }

  // Search overlay (Pagefind UI in #search)
  const searchOpen = document.querySelector(".search-open");
  const overlay = document.getElementById("search-overlay");
  if (searchOpen && overlay) {
    searchOpen.addEventListener("click", function () {
      overlay.classList.add("is-open");
      body.classList.add("search-overlay-open");
      overlay.setAttribute("aria-hidden", "false");
      // Focus search input when overlay opens so user can type immediately
      function focusSearchInput() {
        var input = document.querySelector("#search input[type=\"text\"]") || document.querySelector("#search .pagefind-ui__search-input");
        if (input) {
          input.focus({ preventScroll: false });
          return true;
        }
        return false;
      }
      // Try after overlay transition (250ms) and retry a few times in case Pagefind renders late
      var attempts = [280, 400, 600];
      attempts.forEach(function (delay) {
        setTimeout(function () {
          focusSearchInput();
        }, delay);
      });
    });
    function closeSearch() {
      overlay.classList.remove("is-open");
      body.classList.remove("search-overlay-open");
      overlay.setAttribute("aria-hidden", "true");
    }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeSearch();
    });
    document.querySelector(".search-close")?.addEventListener("click", closeSearch);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeSearch();
    });
  }
})();
