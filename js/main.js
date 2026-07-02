/* Pedro Gandola — Landing page
   Animaciones con GSAP + ScrollTrigger y toggle de tema claro/oscuro. */

(function () {
  "use strict";

  /* ---------- Tema claro / oscuro ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* modo privado */ }
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* modo privado */ }
  });

  /* ---------- Año del footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Animaciones GSAP ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* Carrusel de negocios en el hero: la palabra central en color atardecer,
     la anterior y la siguiente en gris a los costados, con profundidad. */
  var BUSINESSES = [
    "Negocio",
    "Veterinaria",
    "Pastelería",
    "Restaurante",
    "Concesionario",
    "Metalúrgica",
    "Consultorio",
    "Salón de Eventos",
    "Inmobiliaria",
    "Gimnasio",
    "Estudio Contable"
  ];
  var carousel = document.getElementById("bizCarousel");
  carousel.innerHTML = "";
  var words = BUSINESSES.map(function (text) {
    var el = document.createElement("span");
    el.className = "cw";
    var gray = document.createElement("span");
    gray.className = "cw__gray";
    gray.textContent = text;
    var color = document.createElement("span");
    color.className = "cw__color";
    color.setAttribute("aria-hidden", "true");
    color.textContent = text;
    el.appendChild(gray);
    el.appendChild(color);
    carousel.appendChild(el);
    return el;
  });

  var current = 0;
  var LEN = words.length;
  var SIDE_SCALE = 0.4;

  function layoutCarousel(animate) {
    // Separación calculada con el ancho real de cada palabra para que
    // las laterales nunca queden tapadas por la central.
    var gap = Math.max(28, carousel.offsetWidth * 0.035);
    var centerHalf = words[current].offsetWidth / 2;
    var farOffset = carousel.offsetWidth * 0.8;
    words.forEach(function (el, i) {
      var pos = (i - current + LEN) % LEN;
      var t;
      var sideHalf = (el.offsetWidth * SIDE_SCALE) / 2;
      if (pos === 0) {
        // Centro: grande, nítida y a todo color
        t = { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 3 };
      } else if (pos === 1) {
        // La que viene, a la derecha y "atrás"
        t = { x: centerHalf + gap + sideHalf, scale: SIDE_SCALE, opacity: 0.5, filter: "blur(1.5px)", zIndex: 2 };
      } else if (pos === LEN - 1) {
        // La anterior, a la izquierda y "atrás"
        t = { x: -(centerHalf + gap + sideHalf), scale: SIDE_SCALE, opacity: 0.5, filter: "blur(1.5px)", zIndex: 2 };
      } else {
        // El resto espera oculto, del lado por el que va a entrar
        var side = pos <= LEN / 2 ? 1 : -1;
        t = { x: side * farOffset, scale: 0.3, opacity: 0, filter: "blur(3px)", zIndex: 1 };
      }
      t.xPercent = -50;
      t.yPercent = -50;
      // El color "se llena" de izquierda a derecha al llegar al centro
      var clip = pos === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
      var colorEl = el.lastChild;
      if (animate) {
        gsap.to(el, Object.assign({ duration: 0.9, ease: "power3.inOut" }, t));
        gsap.to(colorEl, { clipPath: clip, duration: 0.9, ease: "power2.inOut" });
      } else {
        gsap.set(el, t);
        gsap.set(colorEl, { clipPath: clip });
      }
    });
  }

  layoutCarousel(false);
  window.addEventListener("resize", function () { layoutCarousel(false); });
  // Recalcular cuando cargan las fuentes (cambian los anchos)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { layoutCarousel(false); });
  }
  gsap.delayedCall(2.6, function step() {
    current = (current + 1) % LEN;
    layoutCarousel(true);
    gsap.delayedCall(2.3, step);
  });

  // Entrada del hero
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".nav", { y: -60, opacity: 0, duration: 0.7 })
    .from(".hero__eyebrow", { y: 24, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(".hero__line", { y: 60, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.25")
    .from(".hero__subtitle", { y: 24, opacity: 0, duration: 0.6 }, "-=0.45")
    .from(".hero__cta .btn", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
    .from(".chip", { y: 14, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3");

  // Blobs del fondo flotando
  gsap.to(".blob-blue", {
    x: 60, y: 80, scale: 1.1,
    duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut"
  });
  gsap.to(".blob-green", {
    x: -50, y: -60, scale: 1.15,
    duration: 17, repeat: -1, yoyo: true, ease: "sine.inOut"
  });

  // Cabeceras de sección al hacer scroll
  gsap.utils.toArray(".section__head").forEach(function (head) {
    gsap.from(head.children, {
      scrollTrigger: { trigger: head, start: "top 82%" },
      y: 36, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out"
    });
  });

  // Cards de features y proyectos en cascada
  gsap.utils.toArray(".grid").forEach(function (grid) {
    gsap.from(grid.children, {
      scrollTrigger: { trigger: grid, start: "top 85%" },
      y: 48, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out"
    });
  });

  // Panel de contacto
  gsap.from(".contact-panel__actions .btn", {
    scrollTrigger: { trigger: ".contact-panel", start: "top 80%" },
    scale: 0.85, opacity: 0, duration: 0.55, stagger: 0.12, ease: "back.out(1.6)"
  });
})();
