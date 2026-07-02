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

  /* Rotador de negocios en el hero */
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
  var rotWord = document.getElementById("rotWord");
  var rotIndex = 0;

  function rotateWord() {
    rotIndex = (rotIndex + 1) % BUSINESSES.length;
    var tl = gsap.timeline();
    tl.to(rotWord, { yPercent: -70, opacity: 0, duration: 0.35, ease: "power2.in" })
      .add(function () { rotWord.textContent = BUSINESSES[rotIndex]; })
      .set(rotWord, { yPercent: 70 })
      .to(rotWord, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  }
  gsap.delayedCall(2.4, function repeat() {
    rotateWord();
    gsap.delayedCall(2.2, repeat);
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
