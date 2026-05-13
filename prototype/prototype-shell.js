/* prototype-shell.js — sets up the desktop "phone preview" toggle and remembers it across reloads. */
(function () {
  var KEY = "tf-raw-mode";

  // restore preference on load — URL param wins, falls back to localStorage
  try {
    var params = new URLSearchParams(window.location.search);
    var raw = params.get("raw");
    if (raw === "1") {
      document.body.classList.add("raw-mode");
      localStorage.setItem(KEY, "1");
    } else if (raw === "0") {
      document.body.classList.remove("raw-mode");
      localStorage.setItem(KEY, "0");
    } else if (localStorage.getItem(KEY) === "1") {
      document.body.classList.add("raw-mode");
    }
  } catch (_) { /* private mode etc. — ignore */ }

  // inject the toggle button (only meaningful on desktop; CSS hides on mobile)
  function mount() {
    if (document.querySelector(".preview-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preview-toggle";
    btn.setAttribute("aria-label", "Toggle phone preview");
    btn.innerHTML = '<span class="dot"></span><span class="label"></span>';
    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("raw-mode");
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (_) {}
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
