(function () {
  "use strict";

  /* ---------- Smooth-scroll nav (with fallback) ---------- */
  var supportsSmooth = "scrollBehavior" in document.documentElement.style;

  document.querySelectorAll('.nav-button[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: supportsSmooth ? "smooth" : "auto" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: supportsSmooth ? "smooth" : "auto" });
  });

  /* ---------- Custom audio players ---------- */
  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  var PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';

  var audios = Array.prototype.slice.call(document.querySelectorAll("audio"));

  audios.forEach(function (audio) {
    audio.removeAttribute("controls");
    var label = audio.getAttribute("aria-label") || "audio";

    var wrap = document.createElement("div");
    wrap.className = "player";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "player-btn";
    btn.innerHTML = PLAY;
    btn.setAttribute("aria-label", "Play " + label);

    var seek = document.createElement("input");
    seek.type = "range";
    seek.className = "player-seek";
    seek.min = "0";
    seek.max = "100";
    seek.step = "any";
    seek.value = "0";
    seek.disabled = true;
    seek.setAttribute("aria-label", "Seek " + label);

    var time = document.createElement("span");
    time.className = "player-time";
    time.textContent = "0:00 / 0:00";

    wrap.appendChild(btn);
    wrap.appendChild(seek);
    wrap.appendChild(time);
    audio.parentNode.insertBefore(wrap, audio.nextSibling);

    var scrubbing = false;

    btn.addEventListener("click", function () {
      if (audio.paused) audio.play();
      else audio.pause();
    });

    audio.addEventListener("play", function () {
      btn.innerHTML = PAUSE;
      btn.setAttribute("aria-label", "Pause " + label);
      audios.forEach(function (other) {
        if (other !== audio) other.pause();
      });
    });

    audio.addEventListener("pause", function () {
      btn.innerHTML = PLAY;
      btn.setAttribute("aria-label", "Play " + label);
    });

    audio.addEventListener("loadedmetadata", function () {
      seek.disabled = false;
      seek.max = audio.duration || 0;
      time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
      if (!scrubbing) seek.value = audio.currentTime;
      time.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
    });

    audio.addEventListener("ended", function () {
      btn.innerHTML = PLAY;
      btn.setAttribute("aria-label", "Play " + label);
      seek.value = 0;
    });

    seek.addEventListener("input", function () {
      scrubbing = true;
      time.textContent = fmt(seek.value) + " / " + fmt(audio.duration);
    });

    seek.addEventListener("change", function () {
      audio.currentTime = seek.value;
      scrubbing = false;
    });
  });
})();
