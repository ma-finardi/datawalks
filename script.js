(function () {
  "use strict";

  // Smooth-scroll fallback for browsers without CSS scroll-behavior support.
  var supportsSmooth = "scrollBehavior" in document.documentElement.style;

  document.querySelectorAll('.nav-button[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: supportsSmooth ? "smooth" : "auto" });
      // Move focus for accessibility without re-triggering a jump.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  // Pause any other playing audio when one starts.
  var players = document.querySelectorAll("audio");
  players.forEach(function (player) {
    player.addEventListener("play", function () {
      players.forEach(function (other) {
        if (other !== player) other.pause();
      });
    });
  });
})();
