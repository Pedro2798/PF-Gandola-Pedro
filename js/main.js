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

  /* ---------- Video de fondo del hero ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroVideo = document.querySelector(".hero__video");
  if (heroVideo && reduceMotion) heroVideo.pause();

  /* ---------- Animaciones GSAP ---------- */
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

  // Rueda / engranaje: las palabras están apoyadas sobre el borde superior
  // de un gran círculo invisible cuyo centro queda muy por debajo del texto.
  // Al avanzar, la rueda entera gira: cada palabra recorre el arco,
  // inclinándose tangencialmente como los dientes de un engranaje.
  function layoutCarousel(animate) {
    var wheelR = Math.max(carousel.offsetWidth * 1.5, 900);
    var gap = Math.max(30, carousel.offsetWidth * 0.04);
    var centerHalf = words[current].offsetWidth / 2;
    words.forEach(function (el, i) {
      var pos = (i - current + LEN) % LEN;
      var sideHalf = (el.offsetWidth * SIDE_SCALE) / 2;
      // Separación angular: el arco necesario para que no se toquen
      var sideAng = ((centerHalf + gap + sideHalf) / wheelR) * (180 / Math.PI);
      var t;
      if (pos === 0) {
        t = { ang: 0, scale: 1, opacity: 1, blur: 0, z: 3 };
      } else if (pos === 1) {
        // Invisible en reposo: solo se ve entrar/salir rodando en la transición
        t = { ang: sideAng, scale: SIDE_SCALE, opacity: 0, blur: 2, z: 2 };
      } else if (pos === LEN - 1) {
        t = { ang: -sideAng, scale: SIDE_SCALE, opacity: 0, blur: 2, z: 2 };
      } else {
        var side = pos <= LEN / 2 ? 1 : -1;
        t = { ang: side * sideAng * 2.2, scale: 0.3, opacity: 0, blur: 4, z: 1 };
      }
      el.classList.toggle("cw--center", pos === 0);
      // El color "se llena" de izquierda a derecha al llegar al centro
      var clip = pos === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
      var colorEl = el.lastChild;
      var state = el._wheel || (el._wheel = { ang: t.ang });
      var apply = function () {
        var rad = (state.ang * Math.PI) / 180;
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: Math.sin(rad) * wheelR,
          y: (1 - Math.cos(rad)) * wheelR,
          rotation: state.ang,
          zIndex: t.z
        });
      };
      if (animate) {
        // El ángulo se anima con onUpdate: la palabra sigue de verdad
        // la trayectoria circular de la rueda, no una línea recta.
        gsap.to(state, { ang: t.ang, duration: 1.2, ease: "power2.inOut", onUpdate: apply });
        gsap.to(el, {
          scale: t.scale,
          opacity: t.opacity,
          filter: "blur(" + t.blur + "px)",
          duration: 1.2,
          ease: pos === 0 ? "back.out(1.4)" : "power2.inOut"
        });
        gsap.to(colorEl, { clipPath: clip, duration: 1.2, ease: "power2.inOut" });
      } else {
        state.ang = t.ang;
        apply();
        gsap.set(el, { scale: t.scale, opacity: t.opacity, filter: "blur(" + t.blur + "px)" });
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
  gsap.delayedCall(2.8, function step() {
    current = (current + 1) % LEN;
    layoutCarousel(true);
    gsap.delayedCall(2.6, step);
  });

  // Entrada del hero
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".nav", { y: -60, opacity: 0, duration: 0.7 })
    .from(".hero__panel", { y: 50, opacity: 0, scale: 0.97, duration: 0.9 }, "-=0.4")
    .from(".hero__eyebrow", { y: 24, opacity: 0, duration: 0.5 }, "-=0.4")
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
