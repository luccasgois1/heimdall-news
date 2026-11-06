// Monta a linha do tempo de uma notícia a partir das cenas do HTML.
(function () {
  const stage = document.getElementById("stage");
  const cenas = [...stage.querySelectorAll(".clip")];
  const tl = gsap.timeline({ paused: true });
  const entra = { opacity: 0, y: 26 }, fica = { opacity: 1, y: 0, duration: .45, ease: "power3.out" };
  const pop = { scale: 1, duration: .4, ease: "back.out(2)" };
  let fim = 0;
  cenas.forEach((c, i) => {
    const s = +c.dataset.start, d = +c.dataset.duration;
    fim = s + d;
    // O player não esconde as cenas pelo data-start: cada uma some fora do seu tempo aqui mesmo.
    if (i > 0) { gsap.set(c, { autoAlpha: 0 }); tl.set(c, { autoAlpha: 1 }, s); }
    if (i > 0) tl.fromTo(c.querySelector(".titulo"), entra, fica, s + .05);
    let t = s + .35;
    c.querySelectorAll(".e").forEach((el) => {
      tl.fromTo(el, entra, fica, t);
      el.querySelectorAll(".num").forEach((n, k) => tl.fromTo(n, { scale: 0 }, pop, t + .2 + k * .25));
      el.querySelectorAll(".fill").forEach((f) => tl.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power2.out" }, t + .2));
      t += +(el.dataset.gap || .4);
    });
    const trilho = c.querySelector(".trilho");
    if (trilho) tl.fromTo(trilho, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "none" }, s + .3);
    const doc = c.querySelector(".doc");
    if (doc) {
      tl.fromTo(doc, { x: 0, y: 0, rotation: 0 }, { y: -110, rotation: -5, duration: .6, ease: "power2.out" }, s + .3);
      tl.to(doc, { x: 838, rotation: 5, duration: 1.5, ease: "power1.inOut" }, s + .9);
      tl.to(doc, { y: 0, rotation: 0, duration: .5, ease: "power2.in" }, s + 2.4);
    }
    if (c.querySelector(".corda.m")) {
      tl.to(c.querySelector(".corda.m"), { opacity: 0, duration: .15 }, s + 1.5);
      tl.to(c.querySelector(".corda.e"), { rotation: 40, duration: .6, ease: "bounce.out" }, s + 1.5);
      tl.to(c.querySelector(".corda.d"), { rotation: -40, duration: .6, ease: "bounce.out" }, s + 1.5);
    }
    if (i < cenas.length - 1) tl.to(c, { autoAlpha: 0, duration: .3 }, s + d - .3);
  });
  tl.set({}, {}, fim); // o player mede a duração pela linha do tempo
  window.__timelines = window.__timelines || {};
  window.__timelines[stage.dataset.compositionId] = tl;
})();
