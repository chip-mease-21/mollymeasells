/* Molly Measells — site behaviour */

(function () {
  "use strict";

  /* ---------- Sticky nav border ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var risers = document.querySelectorAll(".rise");
  if (risers.length) {
    if (!("IntersectionObserver" in window)) {
      risers.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      risers.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- The Passage ---------- */
  var passage = document.querySelector(".passage__rail");
  if (passage) {
    var fill = passage.querySelector(".passage__fill");
    var stops = passage.querySelectorAll(".passage__stop");
    var vertical = window.matchMedia("(max-width: 680px)").matches;

    var run = function () {
      window.setTimeout(function () {
        if (fill) {
          if (vertical) { fill.style.height = "62%"; }
          else { fill.style.width = "62%"; }
        }
        stops.forEach(function (s, i) {
          window.setTimeout(function () {
            if (i < 2) { s.classList.add("is-on"); }
          }, 500 + i * 700);
        });
      }, 350);
    };

    if ("IntersectionObserver" in window) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { run(); pio.disconnect(); }
        });
      }, { threshold: 0.3 });
      pio.observe(passage);
    } else { run(); }
  }

  /* ---------- Tide (giving progress) ---------- */
  function paintTide(raised, goal) {
    var tide = document.querySelector(".tide");
    if (!tide) { return; }
    var pct = Math.max(0, Math.min(100, (raised / goal) * 100));

    var numEl = tide.querySelector("[data-tide-raised]");
    var metaEl = tide.querySelector("[data-tide-meta]");
    var water = tide.querySelector(".tide__water");

    if (numEl) {
      numEl.innerHTML =
        "$" + raised.toLocaleString() +
        " <span>of $" + goal.toLocaleString() + "</span>";
    }
    if (metaEl) {
      metaEl.textContent =
        Math.round(pct) + "% raised toward the full goal";
    }
    if (water) {
      window.setTimeout(function () {
        water.style.height = Math.max(pct, 4) + "%";
      }, 400);
    }
  }

  /* ---------- Load site content ---------- */
  fetch("/content/site.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) { return; }

      if (typeof d.raised === "number" && typeof d.goal === "number") {
        paintTide(d.raised, d.goal);
      }

      document.querySelectorAll("[data-substack]").forEach(function (a) {
        if (d.substack) { a.href = d.substack; }
      });
      document.querySelectorAll("[data-give]").forEach(function (a) {
        if (d.give) { a.href = d.give; }
      });
      document.querySelectorAll("[data-email]").forEach(function (a) {
        if (d.email) {
          a.href = "mailto:" + d.email;
          if (a.dataset.email === "text") { a.textContent = d.email; }
        }
      });
    })
    .catch(function () { /* fall back to markup defaults */ });

  /* ---------- Field notes ---------- */
  var notesHost = document.querySelector("[data-notes]");
  if (notesHost) {
    fetch("/content/notes.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var items = (d && d.notes) || [];
        if (!items.length) { return; }
        notesHost.innerHTML = "";
        items.slice(0, 6).forEach(function (n) {
          var el = document.createElement("article");
          el.className = "note";
          var date = document.createElement("p");
          date.className = "note__date";
          date.textContent = n.date || "";
          var wrap = document.createElement("div");
          var t = document.createElement("h3");
          t.className = "note__t";
          t.textContent = n.title || "";
          var b = document.createElement("p");
          b.className = "note__b";
          b.textContent = n.body || "";
          wrap.appendChild(t);
          wrap.appendChild(b);
          el.appendChild(date);
          el.appendChild(wrap);
          notesHost.appendChild(el);
        });
      })
      .catch(function () {});
  }

  /* ---------- Gallery ---------- */
  var galHost = document.querySelector("[data-gallery]");
  if (galHost) {
    fetch("/content/gallery.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var items = (d && d.photos) || [];
        if (!items.length) { return; }
        galHost.innerHTML = "";
        galHost.classList.add("gal");
        items.forEach(function (p) {
          if (!p.image) { return; }
          var fig = document.createElement("figure");
          fig.className = "gal__item";
          var img = document.createElement("img");
          img.src = p.image;
          img.alt = p.caption || "Photo from Molly's journey";
          img.loading = "lazy";
          fig.appendChild(img);
          if (p.caption) {
            var cap = document.createElement("figcaption");
            cap.className = "gal__cap";
            cap.textContent = p.caption;
            fig.appendChild(cap);
          }
          galHost.appendChild(fig);
        });
      })
      .catch(function () {});
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
